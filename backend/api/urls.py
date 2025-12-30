from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProyectoViewSet, TecnologiaViewSet, ProductoViewSet, ContactoViewSet

router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'tecnologias', TecnologiaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'contacto', ContactoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]