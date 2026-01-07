from rest_framework import serializers
from .models import Proyecto, Tecnologia, Producto, Contacto

class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = '__all__'

class TecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnologia
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    iva = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    precio_minimo_venta = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    precio_venta = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
    nombre_completo = serializers.CharField(read_only=True)
    estado_stock = serializers.CharField(read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = '__all__'

from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class PostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'titulo', 'slug', 'resumen', 'imagen', 'categoria', 'estado', 'tags', 'fecha_creacion', 'destacado']