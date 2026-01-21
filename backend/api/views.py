from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Proyecto, Tecnologia, Producto, Contacto, Post
from .serializers import ProyectoSerializer, TecnologiaSerializer, ProductoSerializer, ContactoSerializer, PostSerializer, PostListSerializer
import threading
import resend
import os
from rest_framework.decorators import api_view, action, permission_classes, authentication_classes
from .pokemon_service import PokemonTCGService
from .brainrot_service import BrainrotService
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django.shortcuts import get_object_or_404

# --- VIEWSETS EXISTENTES ---

class ProyectoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [permissions.AllowAny]

class TecnologiaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer
    permission_classes = [permissions.AllowAny]

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

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

# --- LÓGICA DE CORREO (RESEND) ---

def enviar_correos_async(contacto):
    resend.api_key = os.environ.get('RESEND_API_KEY', '')
    if not resend.api_key:
        return

    from_email = "Fehu Developers <contacto@fehudevelopers.cl>"
    
    try:
        resend.Emails.send({
            "from": from_email,
            "to": [contacto.correo],
            "subject": f"Hemos recibido tu solicitud - {contacto.ticket}",
            "text": f"Hola {contacto.nombre},\n\nGracias por contactarnos. Ticket: {contacto.ticket}\n\nMensaje:\n{contacto.mensaje}"
        })
    except Exception as e:
        print(f"Error cliente: {e}")

    try:
        resend.Emails.send({
            "from": from_email,
            "to": ["fehu.developers@gmail.com"],
            "subject": f"Nueva solicitud - {contacto.ticket}",
            "text": f"Ticket: {contacto.ticket}\nNombre: {contacto.nombre}\nCorreo: {contacto.correo}\nMensaje: {contacto.mensaje}"
        })
    except Exception as e:
        print(f"Error admin: {e}")

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    permission_classes = [permissions.AllowAny] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contacto = serializer.save()
        thread = threading.Thread(target=enviar_correos_async, args=(contacto,))
        thread.start()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# --- SERVICIOS EXTERNOS (POKEMON & BRAINROT) ---

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def pokemon_search(request):
    name = request.query_params.get('name', '')
    set_id = request.query_params.get('set', '')
    types = request.query_params.get('types', '')
    rarity = request.query_params.get('rarity', '')
    
    result = PokemonTCGService.search_cards(name=name, set_id=set_id, types=types, rarity=rarity)
    return Response(result)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def pokemon_card_detail(request, card_id):
    card = PokemonTCGService.get_card(card_id)
    if card:
        return Response(card)
    return Response({'error': 'Carta no encontrada'}, status=404)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def pokemon_sets(request):
    return Response(PokemonTCGService.get_sets())

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def brainrot_list(request):
    try:
        cache_key = 'brainrot_lore_cache'
        data = cache.get(cache_key)
        if not data:
            data = BrainrotService.get_latest_lore()
            cache.set(cache_key, data, 60 * 30)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# --- BLOG / POSTS ---

class IsOwnerOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.username == 'azwb'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsOwnerOnly()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer
    
    def get_queryset(self):
        if self.request.user.is_staff:
            queryset = Post.objects.all()
        else:
            queryset = Post.objects.filter(activo=True)
        
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        
        return queryset.order_by('-fecha_creacion')
    
    @action(detail=False, methods=['get'], url_path='slug/(?P<slug>[^/.]+)')
    def by_slug(self, request, slug=None):
        queryset = self.get_queryset()
        post = get_object_or_404(queryset, slug=slug)
        serializer = self.get_serializer(post)
        return Response(serializer.data)