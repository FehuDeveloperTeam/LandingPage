import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProyectos, getTecnologias } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import { IconUser, IconFolder, IconBolt, IconCheck } from '../components/Icons'

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
      className="h-80 perspective-1000 cursor-pointer group"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Frente */}
        <div className="absolute w-full h-full backface-hidden">
          <Card hover={false} className="h-full overflow-hidden">
            <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
              {imagen ? (
                <img 
                  src={imagen} 
                  alt={proyecto.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IconFolder className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col items-center justify-center h-36">
              <h3 className="text-lg font-bold text-center mb-3">{proyecto.nombre}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {proyecto.tecnologias.slice(0, 3).map((t, j) => (
                  <span key={j} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                    {t}
                  </span>
                ))}
                {proyecto.tecnologias.length > 3 && (
                  <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                    +{proyecto.tecnologias.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Atrás */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card hover={false} className="h-full p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm">
              {proyecto.descripcion || 'Proyecto en desarrollo. Más información próximamente.'}
            </p>
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
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-20">
        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="relative">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-2xl">
              <IconUser className="w-20 h-20 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <IconCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Andrés Zurita
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-lg">
              Analista Programador especializado en desarrollo móvil, IoT y realidad aumentada.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link 
                to="/curriculum" 
                className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-gray-900 rounded-xl font-medium shadow-lg shadow-gray-900/20 dark:shadow-white/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Ver Currículum
              </Link>
              <Link 
                to="/demos" 
                className="px-6 py-3 bg-white/70 dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-white/20 rounded-xl font-medium hover:bg-white dark:hover:bg-white/20 transition-all"
              >
                Ver Demos
              </Link>
            </div>
          </div>
        </section>

        {/* Proyectos */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <IconFolder className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Proyectos Destacados</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((p) => (
              <ProjectCard key={p.id} proyecto={p} />
            ))}
          </div>
        </section>

        {/* Tecnologías */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <IconBolt className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Tecnologías</h2>
          </div>
          <Card className="p-6">
            <div className="flex flex-wrap gap-3">
              {tecnologias.map((t) => (
                <span 
                  key={t.id} 
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default"
                >
                  {t.nombre}
                </span>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </PageLayout>
  )
}

export default Home