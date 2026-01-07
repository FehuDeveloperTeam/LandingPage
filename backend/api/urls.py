from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProyectoViewSet, TecnologiaViewSet, ProductoViewSet, ContactoViewSet, PostViewSet,
    pokemon_search, pokemon_card_detail, pokemon_sets, pokemon_rarities, pokemon_types
)

router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'tecnologias', TecnologiaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'contacto', ContactoViewSet)
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Pokemon TCG
    path('pokemon/search/', pokemon_search, name='pokemon-search'),
    path('pokemon/card/<str:card_id>/', pokemon_card_detail, name='pokemon-card-detail'),
    path('pokemon/sets/', pokemon_sets, name='pokemon-sets'),
    path('pokemon/rarities/', pokemon_rarities, name='pokemon-rarities'),
    path('pokemon/types/', pokemon_types, name='pokemon-types'),
]