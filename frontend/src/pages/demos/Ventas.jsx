import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import Card from '../../components/Card'
import SEO from '../../components/SEO'
import { 
  ShoppingCart, Car, Droplets, ArrowRight, 
  ArrowLeft, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react'

function Ventas() {
  const opciones = [
    {
      titulo: 'Productos Tangibles',
      subtitulo: 'E-commerce Automotive',
      descripcion: 'Tienda de repuestos automotrices con catálogo, búsqueda inteligente, carrito de compras y gestión de inventario en tiempo real.',
      icon: Car,
      color: 'blue',
      features: ['Catálogo Dinámico', 'Búsqueda Inteligente', 'Pasarela de Pago', 'Control de Stock'],
      url: '/demos/ventas/tangibles'
    },
    {
      titulo: 'Servicios Intangibles',
      subtitulo: 'Smart Quoter System',
      descripcion: 'Sistema de cotización para servicios de mantenimiento con cálculo automático de costos basado en distancia y tipo de servicio.',
      icon: Droplets,
      color: 'emerald',
      features: ['Cotizador en Vivo', 'Geolocalización', 'Resumen PDF', 'Agenda de Servicios'],
      url: '/demos/ventas/intangibles'
    },
  ]

  return (
    <PageLayout
      titulo="Business Solutions"
      subtitulo="Modelos funcionales de transacciones comerciales y flujos de venta optimizados."
    >
      <SEO 
        title="Demos de Ventas | Soluciones E-commerce"
        description="Explora demos de tiendas online y sistemas de cotización automatizados."
        url="/demos/ventas"
      />

      {/* Header Central Icon */}
      <div className="flex flex-col items-center mb-16">
        <div className="w-20 h-20 rounded-[2rem] bg-gray-900 dark:bg-white flex items-center justify-center shadow-2xl rotate-3">
          <ShoppingCart className="w-10 h-10 text-white dark:text-gray-900 -rotate-3" />
        </div>
        <div className="h-12 w-px bg-gradient-to-b from-gray-900 dark:from-white to-transparent mt-4" />
      </div>

      <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
        {opciones.map((opcion, i) => {
          const Icon = opcion.icon
          const isBlue = opcion.color === 'blue'
          
          return (
            <div key={i} className="group relative">
              {/* Decoración de fondo */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${isBlue ? 'from-blue-600 to-indigo-600' : 'from-emerald-500 to-teal-500'} rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              <Card className="relative h-full overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
                {/* Visual Header */}
                <div className={`h-48 relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-black/20`}>
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${isBlue ? 'from-blue-600 to-indigo-600' : 'from-emerald-600 to-teal-600'}`} />
                  
                  {/* Floating Icon Design */}
                  <div className="relative">
                    <div className={`absolute inset-0 blur-2xl opacity-20 ${isBlue ? 'bg-blue-600' : 'bg-emerald-600'}`} />
                    <Icon className={`relative w-20 h-20 ${isBlue ? 'text-blue-600' : 'text-emerald-600'} transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3`} />
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-white/10">
                    <Sparkles size={12} className={isBlue ? 'text-blue-500' : 'text-emerald-500'} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{opcion.subtitulo}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4">
                    {opcion.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                    {opcion.descripcion}
                  </p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-10">
                    {opcion.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className={isBlue ? 'text-blue-500' : 'text-emerald-500'} />
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-auto">
                    <Link
                      to={opcion.url}
                      className={`group/btn flex items-center justify-between w-full p-1 pr-6 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-900 dark:hover:bg-white transition-all duration-300`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover/btn:bg-transparent`}>
                        <ChevronRight className={`w-5 h-5 ${isBlue ? 'text-blue-600' : 'text-emerald-600'} group-hover/btn:text-white dark:group-hover/btn:text-gray-900`} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] group-hover/btn:text-white dark:group-hover/btn:text-gray-900">
                        Lanzar Aplicación
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 group-hover/btn:text-white dark:group-hover/btn:text-gray-900 transition-all" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-24 flex justify-center">
        <Link
          to="/demos"
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gray-900 dark:hover:border-white transition-all"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Panel de Demos</span>
        </Link>
      </div>
    </PageLayout>
  )
}

export default Ventas