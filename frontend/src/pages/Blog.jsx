import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import { 
  LayoutGrid, 
  Cpu, 
  Code2, 
  BookOpen, 
  Newspaper, 
  Star, 
  ArrowRight,
  Search,
  Clock
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const CATEGORIAS = [
  { id: '', nombre: 'Todos', icono: LayoutGrid },
  { id: 'desarrollo', nombre: 'Desarrollo', icono: Code2 },
  { id: 'tecnologia', nombre: 'Tecnología', icono: Cpu },
  { id: 'ia', nombre: 'IA', icono: Star },
  { id: 'tutorial', nombre: 'Tutorial', icono: BookOpen },
  { id: 'noticia', nombre: 'Noticia', icono: Newspaper },
]

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('')

  // 1. Función de limpieza de URLs optimizada y segura (HTTPS)
  const getDirectUrl = (url) => {
    if (!url) return '';
    
    // Si es Drive, convertir a enlace de visualización directa
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      const fileId = match ? match[1] : null;
      // Usamos el endpoint de visualización directa oficial
      return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
    }

    // Si es ImgBB pero no es el link directo, intentamos que funcione
    // (Lo ideal es pegar siempre el que termina en .jpg)
    return url;
  };

  useEffect(() => {
    fetchPosts()
  }, [categoriaActiva])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/api/posts/`
      if (categoriaActiva) url += `?categoria=${categoriaActiva}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPosts(Array.isArray(data) ? data : (data.results || []))
      }
    } catch (error) {
      console.error('Error cargando posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const destacado = posts.find(p => p.destacado) || posts[0]
  const otrosPosts = destacado ? posts.filter(p => p.id !== destacado.id) : posts

  return (
    <PageLayout>
      <SEO 
        title="Blog de Tecnología y Desarrollo" 
        description="Explora artículos sobre inteligencia artificial, desarrollo de software y tendencias tecnológicas." 
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            BLOG<span className="text-blue-600">.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg font-medium">
            Perspectivas técnicas sobre ingeniería de software y el futuro de la tecnología.
          </p>
        </header>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
          {CATEGORIAS.map((cat) => {
            const Icono = cat.icono
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all
                  ${categoriaActiva === cat.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:text-gray-300'}`}
              >
                <Icono size={16} />
                {cat.nombre}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid gap-8 animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          </div>
        ) : (
          <>
            {/* Post Destacado */}
            {destacado && !categoriaActiva && (
              <Link to={`/blog/${destacado.slug}`} className="block mb-16 group">
                <Card className="overflow-hidden border-none bg-gray-50 dark:bg-gray-900 shadow-2xl transition-all group-hover:shadow-blue-500/10">
                  <div className="grid md:grid-cols-2">
                    {/* Contenedor de imagen corregido */}
                    <div className="relative min-h-[300px] h-64 md:h-full bg-gray-800">
                      <img 
                        src={getDirectUrl(destacado.imagen)} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={destacado.titulo} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible'; }}
                      />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded">Destacado</span>
                        <span className="text-gray-400 text-sm flex items-center gap-1 uppercase tracking-widest font-bold">
                          {destacado.categoria}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight group-hover:text-blue-600 transition-colors text-white">
                        {destacado.titulo}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg line-clamp-3 leading-relaxed">
                        {destacado.resumen}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                        LEER ARTÍCULO COMPLETO <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Listado de Posts */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otrosPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <article className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-900 transition-all hover:border-blue-500/50 hover:shadow-xl">
                    <div className="relative h-52 overflow-hidden bg-gray-900">
                      <img 
                        src={getDirectUrl(post.imagen)} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={post.titulo}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Imagen+no+disponible'; }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                          {post.categoria}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3 font-bold uppercase tracking-widest">
                        <Clock size={12} />
                        {new Date(post.fecha_creacion).toLocaleDateString('es-CL')}
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-blue-600 transition-colors text-white">
                        {post.titulo}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.resumen}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                        VER MÁS <ArrowRight size={14} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <Search className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-bold text-white">No encontramos artículos</h3>
                <p className="text-gray-500">Prueba con otra categoría o vuelve más tarde.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}

export default Blog