from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Proyecto, Tecnologia, Producto, Contacto
from .serializers import ProyectoSerializer, TecnologiaSerializer, ProductoSerializer, ContactoSerializer
import threading
import resend
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .pokemon_service import PokemonTCGService

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


import resend
import os

def enviar_correos_async(contacto):
    """Envía correos usando Resend"""
    resend.api_key = os.environ.get('RESEND_API_KEY', '')
    
    if not resend.api_key:
        print("ERROR: RESEND_API_KEY no configurada")
        return
    
    # Correo al cliente
    try:
        resend.Emails.send({
            "from": "Fehu Developers <contacto@fehudevelopers.cl>",
            "to": [contacto.correo],
            "subject": f"Hemos recibido tu solicitud - {contacto.ticket}",
            "text": f"""
Hola {contacto.nombre},

Gracias por contactarnos. Hemos recibido tu solicitud correctamente.

Tu número de ticket es: {contacto.ticket}

Detalles de tu consulta:
{contacto.mensaje}

Nos pondremos en contacto contigo a la brevedad.

Saludos,
Fehu Developers
            """
        })
        print(f"Correo enviado al cliente: {contacto.correo}")
    except Exception as e:
        print(f"ERROR enviando correo al cliente: {e}")

    # Correo al administrador
    try:
        resend.Emails.send({
            "from": "Fehu Developers <contacto@fehudevelopers.cl>",
            "to": ["fehu.developers@gmail.com"],
            "subject": f"Nueva solicitud de contacto - {contacto.ticket}",
            "text": f"""
Nueva solicitud de contacto recibida:

Ticket: {contacto.ticket}
Nombre: {contacto.nombre} {contacto.apellido}
Teléfono: {contacto.telefono}
Correo: {contacto.correo}

Mensaje:
{contacto.mensaje}
            """
        })
        print(f"Correo enviado al admin")
    except Exception as e:
        print(f"ERROR enviando correo al admin: {e}")

    # Correo al administrador
    try:
        resend.Emails.send({
            "from": "Fehu Developers <onboarding@resend.dev>",
            "to": ["fehu.developers@gmail.com"],
            "subject": f"Nueva solicitud de contacto - {contacto.ticket}",
            "text": f"""
Nueva solicitud de contacto recibida:

Ticket: {contacto.ticket}
Nombre: {contacto.nombre} {contacto.apellido}
Teléfono: {contacto.telefono}
Correo: {contacto.correo}

Mensaje:
{contacto.mensaje}
            """
        })
        print(f"Correo enviado al admin")
    except Exception as e:
        print(f"ERROR enviando correo al admin: {e}")

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

@api_view(['GET'])
def pokemon_search(request):
    """Buscar cartas de Pokémon"""
    name = request.query_params.get('name', '')
    set_id = request.query_params.get('set', '')
    types = request.query_params.get('types', '')
    rarity = request.query_params.get('rarity', '')
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('pageSize', 20))
    
    result = PokemonTCGService.search_cards(
        name=name if name else None,
        set_id=set_id if set_id else None,
        types=types if types else None,
        rarity=rarity if rarity else None,
        page=page,
        page_size=page_size
    )
    
    return Response(result)

@api_view(['GET'])
def pokemon_card_detail(request, card_id):
    """Obtener detalle de una carta"""
    card = PokemonTCGService.get_card(card_id)
    if card:
        return Response(card)
    return Response({'error': 'Carta no encontrada'}, status=404)

@api_view(['GET'])
def pokemon_sets(request):
    """Obtener todos los sets/ediciones"""
    sets = PokemonTCGService.get_sets()
    return Response(sets)

@api_view(['GET'])
def pokemon_rarities(request):
    """Obtener todas las rarezas"""
    rarities = PokemonTCGService.get_rarities()
    return Response(rarities)

@api_view(['GET'])
def pokemon_types(request):
    """Obtener todos los tipos"""
    types = PokemonTCGService.get_types()
    return Response(types)