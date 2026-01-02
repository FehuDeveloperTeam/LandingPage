from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Proyecto, Tecnologia, Producto, Contacto
from .serializers import ProyectoSerializer, TecnologiaSerializer, ProductoSerializer, ContactoSerializer
import threading

class ProyectoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer

class TecnologiaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_queryset(self):
        queryset = Producto.objects.all()
        search = self.request.query_params.get('search', None)
        
        if search:
            terminos = search.split()
            q = Q()
            
            for termino in terminos:
                if termino.isdigit() and len(termino) == 4:
                    anio = int(termino)
                    q &= Q(anio_desde__lte=anio, anio_hasta__gte=anio)
                else:
                    q &= (
                        Q(descripcion__icontains=termino) |
                        Q(marca__icontains=termino) |
                        Q(modelo__icontains=termino) |
                        Q(version__icontains=termino) |
                        Q(posicion__icontains=termino) |
                        Q(ubicacion__icontains=termino) |
                        Q(lado__icontains=termino) |
                        Q(proveedor__icontains=termino) |
                        Q(marca_prod__icontains=termino)
                    )
            
            queryset = queryset.filter(q)
        
        return queryset


def enviar_correos_async(contacto):
    """Envía correos en un hilo separado para no bloquear la respuesta"""
    print(f"Iniciando envío de correos...")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"EMAIL_HOST_PASSWORD configurado: {'Sí' if settings.EMAIL_HOST_PASSWORD else 'No'}")
    
    # Correo al cliente
    try:
        result = send_mail(
            subject=f'Hemos recibido tu solicitud - {contacto.ticket}',
            message=f'''
Hola {contacto.nombre},

Gracias por contactarnos. Hemos recibido tu solicitud correctamente.

Tu número de ticket es: {contacto.ticket}

Detalles de tu consulta:
{contacto.mensaje}

Nos pondremos en contacto contigo a la brevedad.

Saludos,
Fehu Developers
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[contacto.correo],
            fail_silently=False,  # Cambiado a False para ver errores
        )
        print(f"Correo enviado al cliente: {contacto.correo}, resultado: {result}")
    except Exception as e:
        print(f"ERROR enviando correo al cliente: {type(e).__name__}: {e}")

    # Correo al administrador
    try:
        result = send_mail(
            subject=f'Nueva solicitud de contacto - {contacto.ticket}',
            message=f'''
Nueva solicitud de contacto recibida:

Ticket: {contacto.ticket}
Nombre: {contacto.nombre} {contacto.apellido}
Teléfono: {contacto.telefono}
Correo: {contacto.correo}

Mensaje:
{contacto.mensaje}

Fecha: {contacto.fecha}
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['fehu.developers@gmail.com'],
            fail_silently=False,  # Cambiado a False para ver errores
        )
        print(f"Correo enviado al admin, resultado: {result}")
    except Exception as e:
        print(f"ERROR enviando correo al admin: {type(e).__name__}: {e}")

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contacto = serializer.save()

        # Enviar correos en segundo plano
        thread = threading.Thread(target=enviar_correos_async, args=(contacto,))
        thread.start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)