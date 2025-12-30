from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Proyecto, Tecnologia, Producto, Contacto
from .serializers import ProyectoSerializer, TecnologiaSerializer, ProductoSerializer, ContactoSerializer

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

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contacto = serializer.save()

        # Correo al cliente
        try:
            send_mail(
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
                fail_silently=True,
            )
        except Exception as e:
            print(f"Error enviando correo al cliente: {e}")

        # Correo al administrador
        try:
            send_mail(
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
                fail_silently=True,
            )
        except Exception as e:
            print(f"Error enviando correo al admin: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)