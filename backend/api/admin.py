from django.contrib import admin
from .models import Proyecto, Tecnologia, Producto, Contacto
from .models import Post

@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'orden']
    list_editable = ['orden']

@admin.register(Tecnologia)
class TecnologiaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'orden']
    list_editable = ['orden']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['id_producto', 'descripcion', 'marca', 'modelo', 'precio_costo', 'cantidad']
    list_filter = ['marca', 'proveedor']
    search_fields = ['descripcion', 'marca', 'modelo']

@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'nombre', 'apellido', 'correo', 'fecha']
    list_filter = ['fecha']
    search_fields = ['ticket', 'nombre', 'apellido', 'correo']
    readonly_fields = ['fecha']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'categoria', 'estado', 'publicado', 'destacado', 'fecha_creacion']
    list_filter = ['categoria', 'estado', 'publicado', 'destacado']
    search_fields = ['titulo', 'resumen', 'contenido']
    prepopulated_fields = {'slug': ('titulo',)}
    list_editable = ['publicado', 'destacado']