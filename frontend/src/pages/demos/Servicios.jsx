import { useState } from 'react'
import DemoLayout from '../../components/DemoLayout'
import ContactModal from '../../components/ContactModal'
import { 
  Smartphone, Code2, Box, Cpu, Database, 
  Bot, ArrowUpRight, CheckCircle2, X, Terminal, ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

function Servicios() {
  const [servicioActivo, setServicioActivo] = useState(null)
  const [contactoAbierto, setContactoAbierto] = useState(false)
  const [servicioPreseleccionado, setServicioPreseleccionado] = useState(null)

  const servicios = [
    {
      id: 1, titulo: 'Desarrollo Móvil', icono: Smartphone, color: 'from-blue-500 to-cyan-400',
      descripcion: 'Ingeniería de software de alto rendimiento para ecosistemas iOS y Android.',
      tecnologias: ['React Native', 'Expo', 'TypeScript', 'Kotlin'],
      caracteristicas: ['Arquitectura limpia', 'Offline-first ready', 'Push Notification Engines', 'Biometric Auth']
    },
    {
      id: 2, titulo: 'Ecosistemas Web', icono: Code2, color: 'from-violet-500 to-purple-400',
      descripcion: 'Plataformas escalables con enfoque en Core Web Vitals y UX intuitiva.',
      tecnologias: ['React', 'Next.js', 'Django', 'Node.js'],
      caracteristicas: ['Server Side Rendering', 'SEO Dinámico', 'Pasarelas de Pago', 'CMS Headless']
    },
    {
      id: 3, titulo: 'Realidad Aumentada', icono: Box, color: 'from-pink-500 to-rose-400',
      descripcion: 'Capas digitales interactivas para industria 4.0 y retail moderno.',
      tecnologias: ['Unity3D', 'C#', 'Vuforia', 'ARKit'],
      caracteristicas: ['Spatial Tracking', 'Modelado Low-Poly', 'Interactive Catalogs', 'AR Education']
    },
    {
      id: 4, titulo: 'IoT & Firmware', icono: Cpu, color: 'from-amber-500 to-orange-400',
      descripcion: 'Conectividad hardware-to-cloud para monitoreo y control remoto.',
      tecnologias: ['Python', 'ESP32', 'MQTT', 'C++'],
      caracteristicas: ['Protocolos Industriales', 'Low Latency Dashboards', 'Sensor Analytics', 'OTA Updates']
    },
    {
      id: 5, titulo: 'Data Infrastructure', icono: Database, color: 'from-emerald-500 to-teal-400',
      descripcion: 'Diseño de arquitecturas de datos robustas para alto volumen de tráfico.',
      tecnologias: ['PostgreSQL', 'Redis', 'MongoDB', 'Firebase'],
      caracteristicas: ['Database Sharding', 'Query Optimization', 'Data Encryption', 'Automatic Backups']
    },
    {
      id: 6, titulo: 'AI Integration', icono: Bot, color: 'from-indigo-500 to-blue-600',
      descripcion: 'Automatización inteligente mediante LLMs y procesamiento de lenguaje natural.',
      tecnologias: ['OpenAI SDK', 'LangChain', 'Python', 'Vectors'],
      caracteristicas: ['Prompt Engineering', 'Custom RAG Bots', 'Sentiment Analysis', 'Auto-content Pipeline']
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
        <div className="max-w-7xl mx-auto space-y-24 py-12 px-4">

          <div className="flex justify-start mb-8">
            <Link to="/demos" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Soluciones
            </Link>
          </div>
          
          {/* Header de Ingeniería */}
          <header className="text-center space-y-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/10 blur-[100px] -z-10" />
            <div className="inline-flex p-4 rounded-3xl bg-gray-900 text-white shadow-2xl mb-4 rotate-3">
              <Terminal size={40} className="text-violet-400" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              Fehu<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">Devs</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl mx-auto font-medium">
              Transformamos especificaciones técnicas en experiencias digitales de alto impacto.
            </p>
          </header>

          {/* Grid de Soluciones */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => {
              const Icon = s.icono
              return (
                <div 
                  key={s.id} 
                  className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                  onClick={() => setServicioActivo(s)}
                >
                  {/* Hover Decorator */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl`} />
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${s.color} text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <Icon size={32} />
                  </div>

                  <h2 className="text-2xl font-black uppercase italic tracking-tight mb-4">{s.titulo}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">
                    {s.descripcion}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {s.tecnologias.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet-500 group-hover:gap-4 transition-all">
                    Explorar Especificaciones <ArrowUpRight size={14} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Industrial */}
          <section className="relative overflow-hidden bg-gray-900 dark:bg-white rounded-[3rem] p-12 md:p-20 text-center text-white dark:text-gray-900 shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6 relative z-10">
              ¿Iniciamos la Fase 01?
            </h2>
            <p className="text-gray-400 dark:text-gray-500 mb-10 max-w-xl mx-auto font-medium relative z-10">
              Estamos listos para auditar tu idea y proponer un roadmap tecnológico sólido.
            </p>
            <button 
              onClick={() => abrirContacto(null)}
              className="relative z-10 px-12 py-5 bg-violet-600 text-white dark:bg-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Contactar Ingeniería
            </button>
          </section>

          {/* Modal de Detalles Técnico */}
          {servicioActivo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
              <div className="absolute inset-0" onClick={() => setServicioActivo(null)} />
              <div className="relative bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
                <button 
                  onClick={() => setServicioActivo(null)}
                  className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${servicioActivo.color} text-white mb-8 shadow-2xl`}>
                  <servicioActivo.icono size={48} />
                </div>

                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">{servicioActivo.titulo}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                  {servicioActivo.descripcion}
                </p>

                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-4">Tech Stack Principal</h4>
                    <div className="flex flex-wrap gap-3">
                      {servicioActivo.tecnologias.map((tech, i) => (
                        <span key={i} className="px-5 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-sm font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-4">Core Features</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {servicioActivo.caracteristicas.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-violet-500/30 transition-colors">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => abrirContacto(servicioActivo.titulo)}
                  className="w-full mt-12 py-6 bg-violet-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all"
                >
                  Solicitar Auditoría Técnica
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