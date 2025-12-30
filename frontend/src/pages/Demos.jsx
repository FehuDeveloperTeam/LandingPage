import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import ContactModal from '../components/ContactModal'
import { IconRocket, IconCart, IconBriefcase, IconBuilding, IconArrowRight } from '../components/Icons'

function Demos() {
  const [contactoAbierto, setContactoAbierto] = useState(false)

  const demos = [
    {
      titulo: 'E-Commerce',
      descripcion: 'Tienda de repuestos automotrices con carrito de compras, búsqueda y gestión de inventario.',
      icon: IconCart,
      color: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-500/20',
      links: [
        { nombre: 'Productos Tangibles', url: '/demos/ventas/tangibles' },
        { nombre: 'Servicios Intangibles', url: '/demos/ventas/intangibles' },
      ]
    },
    {
      titulo: 'Servicios Profesionales',
      descripcion: 'Portafolio de servicios tecnológicos con formulario de contacto integrado.',
      icon: IconBriefcase,
      color: 'from-violet-500 to-purple-500',
      shadow: 'shadow-violet-500/20',
      links: [
        { nombre: 'Ver Demo', url: '/demos/servicios' },
      ]
    },
    {
      titulo: 'Landing Corporativa',
      descripcion: 'Página de presentación empresarial con secciones de equipo, testimonios y contacto.',
      icon: IconBuilding,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      links: [
        { nombre: 'Ver Demo', url: '/demos/presentacion' },
      ]
    },
  ]

  return (
    <PageLayout
      titulo="Demos"
      subtitulo="Explora diferentes tipos de sitios web y aplicaciones que puedo desarrollar para tu negocio"
    >
      {/* Header icon */}
      <div className="flex justify-center -mt-10 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 flex items-center justify-center shadow-xl">
          <IconRocket className="w-8 h-8 text-white dark:text-gray-900" />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo, i) => {
          const Icon = demo.icon
          return (
            <Card key={i} className="overflow-hidden group">
              {/* Header con gradiente */}
              <div className={`h-32 bg-gradient-to-br ${demo.color} flex items-center justify-center relative overflow-hidden`}>
                <Icon className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{demo.titulo}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  {demo.descripcion}
                </p>
                
                {/* Links */}
                <div className="space-y-2">
                  {demo.links.map((link, j) => (
                    <Link
                      key={j}
                      to={link.url}
                      className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all ${
                        j === 0
                          ? `bg-gradient-to-r ${demo.color} text-white shadow-lg ${demo.shadow} hover:shadow-xl hover:-translate-y-0.5`
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {link.nombre}
                      <IconArrowRight className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Info adicional */}
      <Card className="mt-12 p-8 text-center">
        <h3 className="text-xl font-bold mb-3">¿Necesitas algo personalizado?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Estos son solo ejemplos de lo que puedo hacer. Cada proyecto se adapta a las necesidades específicas de cada cliente.
        </p>
        <button
          onClick={() => setContactoAbierto(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Contáctame
          <IconArrowRight className="w-4 h-4" />
        </button>
      </Card>

      <ContactModal 
        isOpen={contactoAbierto} 
        onClose={() => setContactoAbierto(false)}
      />
    </PageLayout>
  )
}

export default Demos