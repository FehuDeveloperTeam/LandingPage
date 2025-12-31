from django.core.management.base import BaseCommand
from api.models import Proyecto, Tecnologia, Producto

class Command(BaseCommand):
    help = 'Carga datos iniciales'

    def handle(self, *args, **options):
        # Tecnologías
        tecnologias_nombres = [
            'Python', 'Django', 'JavaScript', 'React', 'Flutter',
            'Firebase', 'PostgreSQL', 'Unity', 'C#', 'Kotlin',
            'ESP32', 'IoT', 'Vuforia', 'AR', 'HTML/CSS'
        ]
        
        for nombre in tecnologias_nombres:
            Tecnologia.objects.get_or_create(nombre=nombre)
        
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

        # Productos
        productos_data = [
            {'nombre': 'Filtro de Aceite Toyota', 'descripcion': 'Filtro de aceite original para Toyota Corolla 2015-2022', 'precio': 15990, 'stock': 25, 'marca': 'Toyota', 'modelo': 'Corolla'},
            {'nombre': 'Pastillas de Freno Nissan', 'descripcion': 'Kit de pastillas de freno delanteras para Nissan Sentra', 'precio': 32990, 'stock': 15, 'marca': 'Nissan', 'modelo': 'Sentra'},
            {'nombre': 'Batería Bosch 12V', 'descripcion': 'Batería de alto rendimiento 60Ah para vehículos', 'precio': 89990, 'stock': 10, 'marca': 'Universal', 'modelo': 'Todos'},
            {'nombre': 'Aceite Motor 5W-30', 'descripcion': 'Aceite sintético Mobil 1 para motor, 4 litros', 'precio': 45990, 'stock': 30, 'marca': 'Universal', 'modelo': 'Todos'},
            {'nombre': 'Amortiguador Delantero', 'descripcion': 'Amortiguador Monroe para Chevrolet Spark', 'precio': 67990, 'stock': 8, 'marca': 'Chevrolet', 'modelo': 'Spark'},
        ]

        for data in productos_data:
            Producto.objects.get_or_create(
                nombre=data['nombre'],
                defaults=data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Creados {len(productos_data)} productos'))