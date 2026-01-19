import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProyectos, getTecnologias } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import { 
  User, Folder, Zap, CheckCircle2, 
  ArrowRight, Code, Cpu, Loader2, Sparkles
} from 'lucide-react'

function ProjectCard({ proyecto }) {
  const [flipped, setFlipped] = useState(false)

  const imagenes = {
    'SimpleCuenta': '/images/proyectos/SimpleCuenta.png',
    'ConexionDiaria': '/images/proyectos/ConexionDiaria.png',
    'HHM Neonatologia': '/images/proyectos/Hospital.png',
  }

  const imagen = imagenes[proyecto.nombre]

  return (
    <div 
      className="h-[400px] perspective-1000 cursor-pointer group"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* Frente: Visual & Tech */}
        <div className="absolute w-full h-full backface-hidden">
          <Card hover={false} className="h-full overflow-hidden flex flex-col border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            <div className="h-1/2 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
              {imagen ? (
                <img 
                  src={imagen} 
                  alt={proyecto.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <Folder className="w-16 h-16 text-blue-500/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="p-6 flex flex-col items-center justify-center flex-grow text-center">
              <h3 className="text-xl font-black tracking-tighter mb-4 italic uppercase">{proyecto.nombre}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {proyecto.tecnologias.slice(0, 3).map((t, j) => (
                  <span key={j} className="text-[10px] font-bold px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-full uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <Sparkles size={12} /> Info Detallada
              </div>
            </div>
          </Card>
        </div>

        {/* Atrás: Descripción Pro */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card hover={false} className="h-full p-8 flex flex-col items-center justify-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-0 shadow-2xl">
            <Code className="mb-6 opacity-50" size={32} />
            <p className="text-center leading-relaxed font-medium text-sm md:text-base">
              {proyecto.descripcion || 'Solución tecnológica personalizada diseñada para optimizar procesos y mejorar la experiencia del usuario final.'}
            </p>
            <div className="mt-8 px-4 py-2 border border-current opacity-30 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              Tech Stack Completo
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [proyectos, setProyectos] = useState([])
  const [tecnologias, setTecnologias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [proyectosData, tecnologiasData] = await Promise.all([
          getProyectos(),
          getTecnologias()
        ])
        setProyectos(proyectosData)
        setTecnologias(tecnologiasData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Iniciando Sistemas...</span>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <SEO 
        title="Software Developer & Tech Solutions"
        description="Andrés Zurita - Desarrollo de software de alto impacto, IoT y soluciones digitales avanzadas."
        url="/"
      />
      
      <div className="max-w-6xl mx-auto space-y-32">
        
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-12 md:py-10">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] bg-white dark:bg-gray-800 p-2 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-[2rem] bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                 <User className="w-24 h-24 text-gray-300" />
                 {/* Aquí puedes poner tu foto real: <img src="/tu-foto.jpg" className="object-cover w-full h-full" /> */}
              </div>
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4 ring-white dark:ring-gray-800">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-500 dark:from-white dark:via-blue-400 dark:to-gray-500 bg-clip-text text-transparent italic">
              Andrés Zurita
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed font-medium">
              Analista Programador & Administrador. Transformo ideas complejas en <span className="text-blue-600 font-bold tracking-tight">experiencias digitales</span> robustas y escalables.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to="/curriculum" 
                className="group flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Curriculum <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/demos" 
                className="px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-white/10 transition-all"
              >
                Explorar Demos
              </Link>
            </div>
          </div>
        </section>

        {/* Proyectos Destacados */}
        <section>
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 mb-4">
              <Folder size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Proyectos de Autor</h2>
            <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((p) => (
              <ProjectCard key={p.id} proyecto={p} />
            ))}
          </div>
        </section>

        {/* Tecnologías Stack */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap size={24} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">Ecosistema Tech</h2>
            </div>
          </div>
          
          <Card className="p-10 border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
            <div className="flex flex-wrap gap-4 justify-center">
              {tecnologias.map((t) => (
                <div 
                  key={t.id} 
                  className="group px-6 py-3 bg-white dark:bg-white/5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:text-blue-600 transition-all cursor-default flex items-center gap-3 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nombre}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </PageLayout>
  )
}

export default Home