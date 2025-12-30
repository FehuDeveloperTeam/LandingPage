import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import Card from '../../components/Card'
import { IconCart, IconCar, IconPool, IconArrowRight, IconArrowLeft } from '../../components/Icons'

function Ventas() {
  const opciones = [
    {
      titulo: 'Productos Tangibles',
      descripcion: 'Tienda de repuestos automotrices con catálogo, búsqueda inteligente, carrito de compras y gestión de inventario en tiempo real.',
      icon: IconCar,
      color: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-500/20',
      caracteristicas: ['Catálogo de productos', 'Carrito de compras', 'Búsqueda por marca/modelo', 'Control de stock'],
      url: '/demos/ventas/tangibles'
    },
    {
      titulo: 'Servicios Intangibles',
      descripcion: 'Sistema de cotización para servicios de limpieza de piscinas con cálculo automático de costos por distancia.',
      icon: IconPool,
      color: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-500/20',
      caracteristicas: ['Cotizador interactivo', 'Cálculo de traslado', 'Selección de servicios', 'Resumen de presupuesto'],
      url: '/demos/ventas/intangibles'
    },
  ]

  return (
    <PageLayout
      titulo="Demos de Ventas"
      subtitulo="Ejemplos de tiendas online y sistemas de cotización para diferentes tipos de negocios"
    >
      {/* Header icon */}
      <div className="flex justify-center -mt-10 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center shadow-xl">
          <IconCart className="w-8 h-8 text-white dark:text-gray-900" />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {opciones.map((opcion, i) => {
          const Icon = opcion.icon
          return (
            <Card key={i} className="overflow-hidden group">
              {/* Header */}
              <div className={`h-40 bg-gradient-to-br ${opcion.color} flex items-center justify-center relative overflow-hidden`}>
                <Icon className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Contenido */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">{opcion.titulo}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {opcion.descripcion}
                </p>
                
                {/* Características */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {opcion.caracteristicas.map((c, j) => (
                    <span key={j} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                      {c}
                    </span>
                  ))}
                </div>
                
                {/* Botón */}
                <Link
                  to={opcion.url}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold bg-gradient-to-r ${opcion.color} text-white shadow-lg ${opcion.shadow} hover:shadow-xl hover:-translate-y-0.5 transition-all`}
                >
                  Ver Demo
                  <IconArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Volver */}
      <div className="mt-12 text-center">
        <Link
          to="/demos"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <IconArrowLeft className="w-4 h-4" />
          Volver a Demos
        </Link>
      </div>
    </PageLayout>
  )
}

export default Ventas