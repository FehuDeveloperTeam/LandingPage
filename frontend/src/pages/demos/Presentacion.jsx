import { useState, useEffect, useRef } from 'react'
import DemoLayout from '../../components/DemoLayout'
import ContactModal from '../../components/ContactModal'
import { 
  Laptop, BarChart3, Globe, ShieldCheck, Rocket, 
  Target, Handshake, Zap, Quote, MapPin, 
  Phone, Mail, ArrowRight, ChevronDown, ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Sub-componente para el contador animado con Intersection Observer
function StatCounter({ targetValue, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true)
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let start = 0
    const end = parseInt(targetValue)
    const totalMiliseconds = duration
    const incrementTime = (totalMiliseconds / end)

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [hasStarted, targetValue, duration])

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  )
}

function Presentacion() {
  const [contactoAbierto, setContactoAbierto] = useState(false)

  const servicios = [
    { icono: Laptop, titulo: 'Transformación Digital', descripcion: 'Soluciones tecnológicas que optimizan procesos y aumentan la productividad.' },
    { icono: BarChart3, titulo: 'Consultoría Empresarial', descripcion: 'Análisis estratégico para impulsar el crecimiento sostenible.' },
    { icono: Globe, titulo: 'Desarrollo de Software', descripcion: 'Aplicaciones web y móviles a medida para tu industria.' },
    { icono: ShieldCheck, titulo: 'Ciberseguridad', descripcion: 'Protección de datos con las mejores prácticas de seguridad.' }
  ]

  const stats = [
    { valor: 150, sufijo: '+', texto: 'Proyectos' },
    { valor: 50, sufijo: '+', texto: 'Clientes' },
    { valor: 8, sufijo: '', texto: 'Años de Exp.' },
    { valor: 24, sufijo: '/7', texto: 'Soporte' }
  ]

  const testimonios = [
    { texto: 'Gracias a Nexus pudimos digitalizar completamente nuestra operación. Los resultados superaron nuestras expectativas.', autor: 'María González', cargo: 'Gerente General', empresa: 'Agrícola Valle Verde' },
    { texto: 'El equipo demostró un profesionalismo excepcional. Entregaron antes del plazo con calidad impecable.', autor: 'Roberto Fuentes', cargo: 'Director de Operaciones', empresa: 'Transportes del Sur' },
    { texto: 'La consultoría estratégica nos permitió identificar oportunidades que no habíamos considerado.', autor: 'Carolina Muñoz', cargo: 'CEO', empresa: 'Comercial Ñuble' }
  ]

  return (
    <DemoLayout tema="presentacion">
      {(tema) => (
        <div className="max-w-7xl mx-auto space-y-32 pb-20 px-4">
          <div className="flex justify-start mb-8">
            <Link to="/demos" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Soluciones
            </Link>
          </div>
          
          {/* Hero Section */}
          <header className="relative min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 overflow-hidden">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap size={14} className="animate-pulse" /> Nueva Era Digital en Ñuble
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase">
              Nexus<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Tech</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl font-medium leading-relaxed">
              Ingeniería de vanguardia aplicada al crecimiento de la industria local.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setContactoAbierto(true)}
                className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
              >
                Consulta gratuita
              </button>
              <a href="#servicios" className="px-10 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-50 transition-all">
                Explorar Soluciones <ChevronDown size={16} />
              </a>
            </div>
          </header>

          {/* Stats Section Animada */}
          <section className="bg-gray-900 dark:bg-white rounded-[3rem] p-12 md:p-20 text-white dark:text-gray-900 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-5xl md:text-7xl font-black italic tracking-tighter">
                    <StatCounter targetValue={stat.valor} suffix={stat.sufijo} />
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    {stat.texto}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Servicios */}
          <section id="servicios" className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Capacidades</h2>
                <p className="text-gray-500 font-medium">Infraestructura y consultoría de clase mundial.</p>
              </div>
              <ArrowRight size={40} className="text-emerald-500 hidden md:block" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {servicios.map((s, i) => {
                const Icon = s.icono
                return (
                  <div key={i} className="group p-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500">
                      <Icon className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4">{s.titulo}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{s.descripcion}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Diferenciales */}
          <section className="bg-emerald-500 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Target size={300} strokeWidth={0.5} />
             </div>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-center mb-20">Valor Diferencial</h2>
             <div className="grid gap-12 md:grid-cols-3 relative z-10">
               {[
                 { icono: Target, titulo: 'Custom Focus', texto: 'Desarrollos únicos para desafíos específicos.' },
                 { icono: Handshake, titulo: 'Local Insight', texto: 'Nuestra base está en Ñuble, conocemos tu realidad.' },
                 { icono: Zap, titulo: 'Agile Ops', texto: 'Iteraciones rápidas y resultados constantes.' }
               ].map((item, i) => (
                 <div key={i} className="text-center space-y-4">
                   <item.icono size={48} strokeWidth={1.5} className="mx-auto" />
                   <h3 className="text-xl font-black uppercase tracking-widest">{item.titulo}</h3>
                   <p className="text-emerald-100 font-medium opacity-80">{item.texto}</p>
                 </div>
               ))}
             </div>
          </section>

          {/* Testimonios */}
          <section className="space-y-16">
            <h2 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Trusted by Leaders</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonios.map((t, i) => (
                <div key={i} className="space-y-6 p-8 border-l border-gray-100 dark:border-white/10">
                  <Quote className="text-emerald-500" size={32} />
                  <p className="text-xl font-bold italic tracking-tight leading-snug">"{t.texto}"</p>
                  <div>
                    <p className="font-black uppercase tracking-widest text-[10px]">{t.autor}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{t.cargo} @ {t.empresa}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Contact */}
          <footer className="grid gap-12 md:grid-cols-3 pt-20 border-t border-gray-100 dark:border-white/5">
             {[
               { icon: MapPin, label: 'Ubicación', val: ['Maipú 450, Of. 302', 'San Carlos, Ñuble'] },
               { icon: Phone, label: 'Contacto Directo', val: ['+56 42 241 5000', '+56 9 8765 4321'] },
               { icon: Mail, label: 'Digital', val: ['contacto@nexustech.cl', 'ventas@nexustech.cl'] }
             ].map((c, i) => (
               <div key={i} className="space-y-4">
                 <c.icon size={20} className="text-emerald-500" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{c.label}</p>
                 {c.val.map((line, j) => (
                   <p key={j} className="font-bold text-lg">{line}</p>
                 ))}
               </div>
             ))}
          </footer>

          <ContactModal 
            isOpen={contactoAbierto} 
            onClose={() => setContactoAbierto(false)}
            servicioPreseleccionado="consultoría empresarial"
          />
        </div>
      )}
    </DemoLayout>
  )
}

export default Presentacion