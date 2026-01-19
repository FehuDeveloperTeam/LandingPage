import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import ContactModal from '../components/ContactModal'
import SEO from '../components/SEO'
import { 
  Rocket, ShoppingBag, Briefcase, Building2, 
  ArrowRight, Sparkles, MessageSquare, ExternalLink,
  Layers
} from 'lucide-react'

function Demos() {
  const [contactoAbierto, setContactoAbierto] = useState(false)

  const demos = [
    {
      titulo: 'E-Commerce',
      descripcion: 'Solución integral de ventas con carrito de compras, gestión de inventario y pasarela de pagos simulada.',
      icon: <ShoppingBag size={32} />,
      color: 'from-orange-500 to-amber-500',
      badge: 'Más popular',
      links: [
        { nombre: 'Productos Físicos', url: '/demos/ventas/tangibles' },
        { nombre: 'Servicios Digitales', url: '/demos/ventas/intangibles' },
      ]
    },
    {
      titulo: 'Servicios Pro',
      descripcion: 'Plataforma para profesionales independientes con reserva de citas y exhibición de portafolio dinámico.',
      icon: <Briefcase size={32} />,
      color: 'from-blue-600 to-indigo-600',
      links: [
        { nombre: 'Explorar Solución', url: '/demos/servicios' },
      ]
    },
    {
      titulo: 'Landing Corporativa',
      descripcion: 'Presencia digital de alto impacto con secciones de equipo, testimonios y optimización para conversión.',
      icon: <Building2 size={32} />,
      color: 'from-emerald-600 to-teal-600',
      links: [
        { nombre: 'Visualizar Landing', url: '/demos/presentacion' },
      ]
    },
  ]

  return (
    <PageLayout
      titulo="Showcase de Soluciones"
      subtitulo="Arquitecturas digitales diseñadas para escalar tu visión de negocio al siguiente nivel."
    >
      <SEO 
        title="Soluciones en Software | Fehu Developers"
        description="Explora soluciones interactivas de E-commerce, Landings y Aplicaciones Web profesionales."
        url="/demos"
      />

      {/* Hero Icon */}
      <div className="flex justify-center -mt-10 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-2xl border border-gray-100 dark:border-white/10">
            <Rocket className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo, i) => (
          <div key={i} className="group relative">
            {/* Tarjeta con diseño de "Producto" */}
            <Card className="h-full flex flex-col overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
              {/* Header Visual */}
              <div className={`h-3 bg-gradient-to-r ${demo.color}`} />
              
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${demo.color} text-white shadow-lg`}>
                    {demo.icon}
                  </div>
                  {demo.badge && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full">
                      {demo.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black tracking-tighter mb-3 group-hover:text-blue-600 transition-colors">
                  {demo.titulo}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                  {demo.descripcion}
                </p>
                
                {/* Botones de Acción */}
                <div className="space-y-3">
                  {demo.links.map((link, j) => (
                    <Link
                      key={j}
                      to={link.url}
                      className={`flex items-center justify-between w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                        j === 0
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] shadow-xl'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {link.nombre}
                      {j === 0 ? <Sparkles size={16} /> : <ExternalLink size={16} />}
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* CTA Final Refinado */}
      <div className="mt-20 relative">
        <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 blur-3xl rounded-full" />
        <Card className="relative p-12 text-center border-dashed border-2 border-gray-200 dark:border-white/10 bg-transparent overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 italic">¿Tienes una idea disruptiva?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
              Estos modelos son solo el punto de partida. Diseño y desarrollo soluciones personalizadas que se alinean exactamente con tus KPIs y objetivos de marca.
            </p>
            <button
              onClick={() => setContactoAbierto(true)}
              className="group inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20"
            >
              <MessageSquare size={18} className="group-hover:rotate-12 transition-transform" />
              Iniciar Consultoría Gratuita
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Card>
      </div>

      <ContactModal 
        isOpen={contactoAbierto} 
        onClose={() => setContactoAbierto(false)}
      />
    </PageLayout>
  )
}

export default Demos