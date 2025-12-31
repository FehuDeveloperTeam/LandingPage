from django.core.management.base import BaseCommand
from api.models import Proyecto, Tecnologia, Producto
from decimal import Decimal

class Command(BaseCommand):
    help = 'Carga datos iniciales'

    def handle(self, *args, **options):
        # Tecnologías
        tecnologias_nombres = [
            'Python', 'Django', 'JavaScript', 'React', 'Flutter',
            'Firebase', 'PostgreSQL', 'Unity', 'C#', 'Kotlin',
            'ESP32', 'IoT', 'Vuforia', 'AR', 'HTML/CSS'
        ]
        
        for i, nombre in enumerate(tecnologias_nombres):
            Tecnologia.objects.get_or_create(nombre=nombre, defaults={'orden': i})
        
        self.stdout.write(self.style.SUCCESS(f'Creadas {len(tecnologias_nombres)} tecnologías'))

        # Proyectos
        proyectos_data = [
            {
                'nombre': 'SimpleCuenta',
                'descripcion': 'Aplicación móvil para gestión de finanzas personales con seguimiento de gastos e ingresos.',
                'tecnologias': ['Flutter', 'Firebase', 'Kotlin'],
                'orden': 1
            },
            {
                'nombre': 'ConexionDiaria',
                'descripcion': 'App de bienestar personal con recordatorios, seguimiento de hábitos y estadísticas.',
                'tecnologias': ['Flutter', 'Firebase', 'Python'],
                'orden': 2
            },
            {
                'nombre': 'HHM Neonatología',
                'descripcion': 'Sistema de gestión hospitalaria para el área de neonatología con seguimiento de pacientes.',
                'tecnologias': ['Python', 'Django', 'PostgreSQL', 'React'],
                'orden': 3
            },
        ]

        for data in proyectos_data:
            proyecto, created = Proyecto.objects.get_or_create(
                nombre=data['nombre'],
                defaults={
                    'descripcion': data['descripcion'],
                    'tecnologias': data['tecnologias'],
                    'orden': data['orden']
                }
            )
        
        self.stdout.write(self.style.SUCCESS(f'Creados {len(proyectos_data)} proyectos'))

        # Productos (repuestos automotrices)
        productos_data = [
            {
                'id_producto': 'FLT-001',
                'proveedor': 'AutoPartes Chile',
                'codigo_proveedor': 'AP-FLT-2024',
                'descripcion': 'Filtro de Aceite',
                'posicion': 'Motor',
                'ubicacion': '',
                'lado': '',
                'marca': 'Toyota',
                'modelo': 'Corolla',
                'anio_desde': 2015,
                'anio_hasta': 2022,
                'version': '1.8L',
                'marca_prod': 'Sakura',
                'imagen0': '',
                'imagen1': '',
                'precio_costo': Decimal('8500'),
                'cantidad': 25
            },
            {
                'id_producto': 'PST-002',
                'proveedor': 'Frenos Express',
                'codigo_proveedor': 'FE-PST-100',
                'descripcion': 'Pastillas de Freno',
                'posicion': 'Delantero',
                'ubicacion': 'Rueda',
                'lado': 'Ambos',
                'marca': 'Nissan',
                'modelo': 'Sentra',
                'anio_desde': 2018,
                'anio_hasta': 2024,
                'version': '2.0L',
                'marca_prod': 'Brembo',
                'imagen0': '',
                'imagen1': '',
                'precio_costo': Decimal('18000'),
                'cantidad': 15
            },
            {
                'id_producto': 'BAT-003',
                'proveedor': 'Baterías Sur',
                'codigo_proveedor': 'BS-BAT-60',
                'descripcion': 'Batería 12V 60Ah',
                'posicion': '',
                'ubicacion': 'Motor',
                'lado': '',
                'marca': 'Universal',
                'modelo': 'Todos',
                'anio_desde': 2010,
                'anio_hasta': 2024,
                'version': '',
                'marca_prod': 'Bosch',
                'imagen0': '',
                'imagen1': '',
                'precio_costo': Decimal('55000'),
                'cantidad': 10
            },
            {
                'id_producto': 'ACE-004',
                'proveedor': 'Lubricantes Pro',
                'codigo_proveedor': 'LP-ACE-5W30',
                'descripcion': 'Aceite Motor 5W-30 Sintético',
                'posicion': '',
                'ubicacion': '',
                'lado': '',
                'marca': 'Universal',
                'modelo': 'Todos',
                'anio_desde': 2000,
                'anio_hasta': 2024,
                'version': '4 Litros',
                'marca_prod': 'Mobil 1',
                'imagen0': '',
                'imagen1': '',
                'precio_costo': Decimal('28000'),
                'cantidad': 30
            },
            {
                'id_producto': 'AMT-005',
                'proveedor': 'Suspensión Total',
                'codigo_proveedor': 'ST-AMT-SPK',
                'descripcion': 'Amortiguador',
                'posicion': 'Delantero',
                'ubicacion': 'Suspensión',
                'lado': 'Derecho',
                'marca': 'Chevrolet',
                'modelo': 'Spark',
                'anio_desde': 2016,
                'anio_hasta': 2023,
                'version': '1.2L',
                'marca_prod': 'Monroe',
                'imagen0': '',
                'imagen1': '',
                'precio_costo': Decimal('42000'),
                'cantidad': 8
            },
        ]

        for data in productos_data:
            Producto.objects.get_or_create(
                id_producto=data['id_producto'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Creados {len(productos_data)} productos'))