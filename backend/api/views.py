from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Proyecto, Tecnologia, Producto, Contacto
from .serializers import ProyectoSerializer, TecnologiaSerializer, ProductoSerializer, ContactoSerializer
import threading
import resend
import os
from rest_framework.decorators import api_view, action, permission_classes, authentication_classes
from .pokemon_service import PokemonTCGService
from .models import Post
from .serializers import PostSerializer, PostListSerializer
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django.shortcuts import get_object_or_404
from .brainrot_service import BrainrotService

# ... (ViewSets de Proyecto, Tecnologia y Producto se mantienen igual)

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

def enviar_correos_async(contacto):
    """Envía correos usando Resend con dominio verificado"""
    resend.api_key = os.environ.get('RESEND_API_KEY', '')
    
    if not resend.api_key:
        print("ERROR: RESEND_API_KEY no configurada")
        return

    from_email = "Fehu Developers <contacto@fehudevelopers.cl>"
    
    # 1. Correo de confirmación al CLIENTE
    try:
        resend.Emails.send({
            "from": from_email,
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
Equipo Fehu Developers
            """
        })
        print(f"Correo enviado al cliente: {contacto.correo}")
    except Exception as e:
        print(f"ERROR enviando correo al cliente: {e}")

    # 2. Correo de notificación al ADMINISTRADOR
    try:
        resend.Emails.send({
            "from": from_email,
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
        print(f"Correo de notificación enviado al admin")
    except Exception as e:
        print(f"ERROR enviando correo al admin: {e}")

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    # AGREGADO: Permite que usuarios no autenticados envíen el formulario
    permission_classes = [permissions.AllowAny] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contacto = serializer.save()

        # Enviar correos en segundo plano
        thread = threading.Thread(target=enviar_correos_async, args=(contacto,))
        thread.start()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

# ... (El resto de las funciones de Pokemon y el PostViewSet se mantienen idénticos)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])

def pokemon_search(request):
    name = request.query_params.get('name', '')
    set_id = request.query_params.get('set', '')
    types = request.query_params.get('types', '')
    rarity = request.query_params.get('rarity', '')
    
    
    result = PokemonTCGService.search_cards(
        name=name if name else None,
        set_id=set_id if set_id else None,
        types=types if types else None,
        rarity=rarity if rarity else None
    )

    cached_data = cache.get(result)
    if cached_data is None:
        cache.set('pokemon_search_result', result, 60 * 60)  # Cache for 60 minutes
        return Response(result)
    return Response(cached_data)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])

def pokemon_card_detail(request, card_id):
    """Obtener detalle de una carta"""
    
    card = PokemonTCGService.get_card(card_id)
    if card:
        return Response(card)
    return Response({'error': 'Carta no encontrada'}, status=404)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])

def pokemon_sets(request):
    
    """Obtener todos los sets/ediciones"""
    sets = PokemonTCGService.get_sets()
    return Response(sets)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])

def pokemon_rarities(request):
    
    """Obtener todas las rarezas"""
    rarities = PokemonTCGService.get_rarities()
    return Response(rarities)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])

def pokemon_types(request):
    
    """Obtener todos los tipos"""
    types = PokemonTCGService.get_types()
    return Response(types)

class IsOwnerOnly(permissions.BasePermission):
    """
    Permiso que solo permite a un usuario específico (azwb) realizar cambios.
    """
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
        estado = self.request.query_params.get('estado')
        destacado = self.request.query_params.get('destacado')
        
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        
        if estado:
            queryset = queryset.filter(estado=estado)
        
        if destacado == 'true':
            queryset = queryset.filter(destacado=True)
        
        return queryset.order_by('-fecha_creacion')
    
    @action(detail=False, methods=['get'], url_path='slug/(?P<slug>[^/.]+)')
    def by_slug(self, request, slug=None):
        queryset = self.get_queryset()
        post = get_object_or_404(queryset, slug=slug)
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def brainrot_list(request):
    """Obtener la enciclopedia dinámica de Brainrot"""
    try:
        # Podríamos implementar cache aquí como hiciste con Pokemon
        cache_key = 'brainrot_lore_cache'
        data = cache.get(cache_key)
        
        if not data:
            data = BrainrotService.get_latest_lore()
            cache.set(cache_key, data, 60 * 30)  # Cache por 30 minutos
            
        return Response(data)
    except Exception as e:
        return Response({"error": f"Error al procesar el Lore: {str(e)}"}, status=500)