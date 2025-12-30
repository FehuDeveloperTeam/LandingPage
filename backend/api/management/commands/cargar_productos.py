from django.core.management.base import BaseCommand
from api.models import Producto
import random

class Command(BaseCommand):
    help = 'Carga 100 productos de prueba'

    def handle(self, *args, **options):
        # Limpiar productos existentes
        Producto.objects.all().delete()

        proveedores = ['BICIMOTO', 'DERCO', 'AUTOPLANET', 'REPMAN', 'CHILE AUTOS']
        marcas_prod = ['DIFORZA', 'FPI', 'TAIWAN', 'ORIGINAL', 'GENERICO']
        
        vehiculos = [
            {'marca': 'TOYOTA', 'modelo': 'YARIS', 'versiones': ['SEDAN', 'HATCHBACK', 'SPORT']},
            {'marca': 'TOYOTA', 'modelo': 'COROLLA', 'versiones': ['XLI', 'GLI', 'SEG']},
            {'marca': 'TOYOTA', 'modelo': 'HILUX', 'versiones': ['SR', 'SRV', 'SRX']},
            {'marca': 'TOYOTA', 'modelo': 'RAV4', 'versiones': ['XLE', 'LIMITED', 'ADVENTURE']},
            {'marca': 'MITSUBISHI', 'modelo': 'L200', 'versiones': ['KATANA', 'DAKAR', 'HPE']},
            {'marca': 'MITSUBISHI', 'modelo': 'ASX', 'versiones': ['GL', 'GLS', 'GT']},
            {'marca': 'NISSAN', 'modelo': 'QASHQAI', 'versiones': ['SENSE', 'ADVANCE', 'EXCLUSIVE']},
            {'marca': 'NISSAN', 'modelo': 'FRONTIER', 'versiones': ['XE', 'SE', 'LE']},
            {'marca': 'HYUNDAI', 'modelo': 'ACCENT', 'versiones': ['GL', 'GLS', 'PREMIUM']},
            {'marca': 'HYUNDAI', 'modelo': 'TUCSON', 'versiones': ['GL', 'GLS', 'LIMITED']},
            {'marca': 'KIA', 'modelo': 'SPORTAGE', 'versiones': ['LX', 'EX', 'GT LINE']},
            {'marca': 'KIA', 'modelo': 'CERATO', 'versiones': ['LX', 'EX', 'SX']},
            {'marca': 'CHEVROLET', 'modelo': 'SPARK', 'versiones': ['LT', 'GT', 'PREMIER']},
            {'marca': 'CHEVROLET', 'modelo': 'SAIL', 'versiones': ['LS', 'LT', 'LTZ']},
            {'marca': 'SUZUKI', 'modelo': 'SWIFT', 'versiones': ['GL', 'GLX', 'SPORT']},
            {'marca': 'MAZDA', 'modelo': 'CX-5', 'versiones': ['R', 'GT', 'SIGNATURE']},
        ]

        repuestos = [
            {'desc': 'MANILLA PUERTA', 'pos': ['DELANTERA', 'TRASERA'], 'ubic': ['EXTERIOR', 'INTERIOR'], 'lado': ['LH', 'RH'], 'precio_base': 4000, 'tipo': 'ACC'},
            {'desc': 'ESPEJO RETROVISOR', 'pos': [''], 'ubic': ['EXTERIOR'], 'lado': ['LH', 'RH'], 'precio_base': 25000, 'tipo': 'ACC'},
            {'desc': 'FOCO DELANTERO', 'pos': [''], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 35000, 'tipo': 'REP'},
            {'desc': 'FOCO TRASERO', 'pos': [''], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 28000, 'tipo': 'REP'},
            {'desc': 'PARACHOQUE', 'pos': [''], 'ubic': ['DELANTERO', 'TRASERO'], 'lado': [''], 'precio_base': 45000, 'tipo': 'REP'},
            {'desc': 'CAPOT', 'pos': [''], 'ubic': [''], 'lado': [''], 'precio_base': 85000, 'tipo': 'REP'},
            {'desc': 'GUARDAFANGO', 'pos': ['DELANTERO', 'TRASERO'], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 32000, 'tipo': 'REP'},
            {'desc': 'MOLDURA PUERTA', 'pos': ['DELANTERA', 'TRASERA'], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 12000, 'tipo': 'ACC'},
            {'desc': 'REJILLA PARACHOQUE', 'pos': [''], 'ubic': ['INFERIOR', 'SUPERIOR'], 'lado': [''], 'precio_base': 18000, 'tipo': 'ACC'},
            {'desc': 'TAPABARROS', 'pos': ['DELANTERO', 'TRASERO'], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 8000, 'tipo': 'ACC'},
            {'desc': 'PANEL PUERTA', 'pos': ['DELANTERA', 'TRASERA'], 'ubic': ['INTERIOR'], 'lado': ['LH', 'RH'], 'precio_base': 55000, 'tipo': 'REP'},
            {'desc': 'VIDRIO PUERTA', 'pos': ['DELANTERA', 'TRASERA'], 'ubic': [''], 'lado': ['LH', 'RH'], 'precio_base': 42000, 'tipo': 'REP'},
            {'desc': 'NEBLINERO', 'pos': [''], 'ubic': ['DELANTERO'], 'lado': ['LH', 'RH'], 'precio_base': 22000, 'tipo': 'ACC'},
            {'desc': 'RADIADOR', 'pos': [''], 'ubic': [''], 'lado': [''], 'precio_base': 75000, 'tipo': 'REP'},
            {'desc': 'CONDENSADOR AC', 'pos': [''], 'ubic': [''], 'lado': [''], 'precio_base': 68000, 'tipo': 'REP'},
        ]

        productos_creados = 0
        acc_counter = 1
        rep_counter = 1

        while productos_creados < 100:
            vehiculo = random.choice(vehiculos)
            repuesto = random.choice(repuestos)
            
            posicion = random.choice(repuesto['pos'])
            ubicacion = random.choice(repuesto['ubic'])
            lado = random.choice(repuesto['lado'])
            
            anio_desde = random.randint(2010, 2020)
            anio_hasta = anio_desde + random.randint(2, 6)
            
            precio_variacion = random.uniform(0.8, 1.3)
            precio_costo = int(repuesto['precio_base'] * precio_variacion)
            
            if repuesto['tipo'] == 'ACC':
                id_producto = f"ACC{str(acc_counter).zfill(6)}"
                acc_counter += 1
            else:
                id_producto = f"REP{str(rep_counter).zfill(6)}"
                rep_counter += 1

            Producto.objects.create(
                id_producto=id_producto,
                proveedor=random.choice(proveedores),
                codigo_proveedor=f"COD{random.randint(10000, 99999)}",
                descripcion=repuesto['desc'],
                posicion=posicion,
                ubicacion=ubicacion,
                lado=lado,
                marca=vehiculo['marca'],
                modelo=vehiculo['modelo'],
                anio_desde=anio_desde,
                anio_hasta=anio_hasta,
                version=random.choice(vehiculo['versiones']),
                marca_prod=random.choice(marcas_prod),
                imagen0='',
                imagen1='',
                precio_costo=precio_costo,
                cantidad=random.randint(0, 50)
            )
            productos_creados += 1

        self.stdout.write(self.style.SUCCESS(f'Se crearon {productos_creados} productos'))