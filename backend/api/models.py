from django.db import models
from decimal import Decimal, ROUND_UP


class Proyecto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    tecnologias = models.JSONField(default=list)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class Tecnologia(models.Model):
    nombre = models.CharField(max_length=50)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    id_producto = models.CharField(max_length=20, unique=True)
    proveedor = models.CharField(max_length=100)
    codigo_proveedor = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=200)
    posicion = models.CharField(max_length=50, blank=True)
    ubicacion = models.CharField(max_length=50, blank=True)
    lado = models.CharField(max_length=50, blank=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    anio_desde = models.IntegerField()
    anio_hasta = models.IntegerField()
    version = models.CharField(max_length=50, blank=True)
    marca_prod = models.CharField(max_length=50)
    imagen0 = models.URLField(blank=True)
    imagen1 = models.URLField(blank=True)
    precio_costo = models.DecimalField(max_digits=10, decimal_places=0)
    cantidad = models.IntegerField(default=0)

    @property
    def iva(self):
        return self.precio_costo * Decimal('0.19')

    @property
    def precio_minimo_venta(self):
        return (self.precio_costo + self.iva) * Decimal('1.4')

    @property
    def precio_venta(self):
        precio = self.precio_minimo_venta * Decimal('1.25')
        miles = int(precio // 1000)
        return (miles * 1000) + 990

    @property
    def nombre_completo(self):
        partes = [self.descripcion, self.ubicacion, self.lado, self.posicion, 
                  self.marca, self.modelo, str(self.anio_desde), "-", str(self.anio_hasta)]
        return ' '.join([p for p in partes if p])

    @property
    def estado_stock(self):
        if self.cantidad > 5:
            return "Stock disponible"
        elif self.cantidad >= 2:
            return "Últimas unidades"
        elif self.cantidad == 1:
            return "Última unidad"
        return "Sin stock"

    def __str__(self):
        return f"{self.id_producto} - {self.descripcion}"


class Contacto(models.Model):
    ticket = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ticket} - {self.nombre} {self.apellido}"