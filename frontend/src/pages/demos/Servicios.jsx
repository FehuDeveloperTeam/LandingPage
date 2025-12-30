import { useState } from 'react'
import DemoLayout from '../../components/DemoLayout'
import ContactModal from '../../components/ContactModal'

function Servicios() {
  const [servicioActivo, setServicioActivo] = useState(null)
  const [contactoAbierto, setContactoAbierto] = useState(false)
  const [servicioPreseleccionado, setServicioPreseleccionado] = useState(null)

  const servicios = [
    {
      id: 1, titulo: 'Desarrollo Móvil', icono: '📱',
      descripcion: 'Aplicaciones nativas y multiplataforma para Android e iOS.',
      tecnologias: ['React Native', 'Expo', 'TypeScript', 'Kotlin', 'Android Studio'],
      caracteristicas: ['Apps nativas para Android con Kotlin', 'Apps multiplataforma con React Native', 'Integración con Firebase', 'Publicación en stores', 'Diseño UI/UX moderno', 'Push notifications']
    },
    {
      id: 2, titulo: 'Desarrollo Web', icono: '🌐',
      descripcion: 'Sitios web modernos, landing pages y aplicaciones web.',
      tecnologias: ['React', 'TypeScript', 'Django', 'Python', 'Node.js', 'SQL'],
      caracteristicas: ['Landing pages responsivas', 'Apps SPA con React', 'Backend con Django', 'APIs REST seguras', 'Bases de datos', 'Deploy en cloud']
    },
    {
      id: 3, titulo: 'Realidad Aumentada', icono: '🥽',
      descripcion: 'Experiencias AR para marketing, educación y entretenimiento.',
      tecnologias: ['Unity3D', 'Vuforia', 'C#'],
      caracteristicas: ['Reconocimiento de imágenes', 'Juegos interactivos AR', 'Catálogos 3D', 'Experiencias educativas', 'Modelos 3D interactivos']
    },
    {
      id: 4, titulo: 'IoT y Hardware', icono: '🔌',
      descripcion: 'Integración de dispositivos, sensores y sistemas embebidos.',
      tecnologias: ['Python', 'Firebase', 'ESP32', 'Kotlin'],
      caracteristicas: ['Microcontroladores ESP32', 'Comunicación Bluetooth/WiFi', 'Apps de control', 'Dashboards en tiempo real', 'Automatización']
    },
    {
      id: 5, titulo: 'Bases de Datos', icono: '🗄️',
      descripcion: 'Diseño, implementación y optimización de bases de datos.',
      tecnologias: ['SQL', 'NoSQL', 'Firebase', 'Django'],
      caracteristicas: ['Diseño de esquemas', 'Optimización', 'Respaldos', 'Migraciones', 'Reportes']
    },
    {
      id: 6, titulo: 'IA y Prompts', icono: '🤖',
      descripcion: 'Integración de inteligencia artificial y automatización.',
      tecnologias: ['IA Prompts', 'Python', 'JavaScript'],
      caracteristicas: ['Diseño de prompts', 'Chatbots', 'Automatización', 'Generación de contenido', 'Asistentes virtuales']
    },
  ]

  const abrirContacto = (servicio = null) => {
    setServicioPreseleccionado(servicio)
    setContactoAbierto(true)
    setServicioActivo(null)
  }

  return (
    <DemoLayout tema="servicios">
      {(tema) => (
        <div className="space-y-16">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-4xl shadow-lg shadow-violet-500/30 mb-2">
              💻
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
              Fehu Developers
            </h1>
            <p className={`${tema.textMuted} text-lg max-w-xl mx-auto`}>
              Soluciones tecnológicas a tu medida
            </p>
          </header>

          {/* Grid de servicios */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
              <div 
                key={servicio.id} 
                className={`${tema.card} rounded-2xl p-6 ${tema.cardHover} transition-all duration-500 group cursor-pointer`}
                onClick={() => setServicioActivo(servicio)}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {servicio.icono}
                </div>
                <h2 className="text-xl font-bold mb-2">{servicio.titulo}</h2>
                <p className={`${tema.textMuted} mb-4 text-sm`}>{servicio.descripcion}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {servicio.tecnologias.slice(0, 3).map((tech, i) => (
                    <span key={i} className={`text-xs px-3 py-1 ${tema.badge} rounded-full`}>
                      {tech}
                    </span>
                  ))}
                  {servicio.tecnologias.length > 3 && (
                    <span className={`text-xs px-3 py-1 ${tema.badge} rounded-full`}>
                      +{servicio.tecnologias.length - 3}
                    </span>
                  )}
                </div>

                <span className={`${tema.textAccent} font-medium text-sm group-hover:underline`}>
                  Ver más →
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <section className={`${tema.card} rounded-3xl p-12 text-center`}>
            <h2 className="text-3xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
            <p className={`${tema.textMuted} mb-8 max-w-xl mx-auto`}>
              Conversemos sobre cómo puedo ayudarte a convertir tu idea en realidad
            </p>
            <button 
              onClick={() => abrirContacto(null)}
              className={`px-10 py-4 ${tema.btnPrimary} rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105`}
            >
              Contactar ahora
            </button>
          </section>

          {/* Modal de detalles */}
          {servicioActivo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setServicioActivo(null)} />
              <div className={`relative ${tema.card} rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl`}>
                <button 
                  onClick={() => setServicioActivo(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xl"
                >
                  ×
                </button>
                
                <div className="text-6xl mb-4">{servicioActivo.icono}</div>
                <h3 className="text-2xl font-bold mb-2">{servicioActivo.titulo}</h3>
                <p className={`${tema.textMuted} mb-6`}>{servicioActivo.descripcion}</p>

                <div className="mb-6">
                  <h4 className="font-bold mb-3">Tecnologías</h4>
                  <div className="flex flex-wrap gap-2">
                    {servicioActivo.tecnologias.map((tech, i) => (
                      <span key={i} className={`text-sm px-4 py-2 ${tema.badge} rounded-full`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold mb-3">Incluye</h4>
                  <ul className="space-y-2">
                    {servicioActivo.caracteristicas.map((c, i) => (
                      <li key={i} className={`flex items-center gap-3 ${tema.textMuted}`}>
                        <span className="text-green-500">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => abrirContacto(servicioActivo.titulo)}
                  className={`w-full py-4 ${tema.btnPrimary} rounded-xl font-semibold transition-all duration-300 hover:scale-105`}
                >
                  Solicitar cotización
                </button>
              </div>
            </div>
          )}

          <ContactModal 
            isOpen={contactoAbierto} 
            onClose={() => setContactoAbierto(false)}
            servicioPreseleccionado={servicioPreseleccionado}
          />
        </div>
      )}
    </DemoLayout>
  )
}

export default Servicios