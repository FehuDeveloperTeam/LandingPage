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
  Clock,
  Loader2
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

  // 1. FUNCIÓN DE IMAGEN UNIVERSAL (DRIVE, IMGBB, DIRECTO)
  const getDirectUrl = (url) => {
    if (!url) return '';
    if (url.includes('i.ibb.co')) return url; // ImgBB Directo
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      const fileId = match ? match[1] : null;
      return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
    }
    return url;
  };

  // 2. FETCH DE POSTS CON FILTROS CORREGIDOS
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams();
      if (categoriaActiva) params.append('categoria', categoriaActiva);
      
      const url = `${API_URL}/api/posts/${params.toString() ? `?${params.toString()}` : ''}`;
      
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

  useEffect(() => {
    fetchPosts()
  }, [categoriaActiva])

  // Lógica para separar el post destacado
  const destacado = posts.find(p => p.destacado) || posts[0]
  const otrosPosts = destacado ? posts.filter(p => p.id !== destacado.id) : posts

  return (
    <PageLayout>
      <SEO 
        title="Blog de Tecnología y Desarrollo" 
        description="Explora artículos sobre IA, desarrollo de software y tendencias tecnológicas." 
      />

      {/* Contenedor Principal Adaptativo (Modo Claro/Oscuro) */}
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Header */}
          <header className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
              BLOG<span className="text-blue-600">.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg font-medium">
              Perspectivas técnicas sobre ingeniería de software y el futuro de la tecnología.
            </p>
          </header>

          {/* Filtros de Categoría */}
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
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-transparent hover:border-blue-400'}`}
                >
                  <Icono size={16} />
                  {cat.nombre}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-500 font-bold animate-pulse tracking-widest text-xs">CARGANDO CONTENIDO...</p>
            </div>
          ) : (
            <>
              {/* 1. POST DESTACADO (Solo se muestra si NO hay un filtro activo) */}
              {destacado && !categoriaActiva && (
                <Link to={`/blog/${destacado.slug}`} className="block mb-16 group">
                  <div className="overflow-hidden rounded-[32px] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl transition-all group-hover:shadow-blue-500/10">
                    <div className="grid md:grid-cols-2">
                      <div className="relative min-h-[350px] bg-gray-200 dark:bg-gray-800">
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
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">
                            {destacado.categoria}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tighter">
                          {destacado.titulo}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg line-clamp-3 leading-relaxed">
                          {destacado.resumen}
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-black group-hover:gap-4 transition-all text-sm uppercase tracking-widest">
                          Leer artículo completo <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* 2. CUADRÍCULA DE POSTS (Si hay filtro, muestra todos los posts filtrados aquí) */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(categoriaActiva ? posts : otrosPosts).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <article className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1">
                      <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <img 
                          src={getDirectUrl(post.imagen)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt={post.titulo}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Imagen+no+disponible'; }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
                            {post.categoria}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] mb-4 font-black uppercase tracking-widest">
                          <Clock size={12} />
                          {new Date(post.fecha_creacion).toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-bold mb-3 leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {post.titulo}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                          {post.resumen}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest">
                          Ver más <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* 3. MENSAJE SIN RESULTADOS */}
              {posts.length === 0 && (
                <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <Search className="mx-auto mb-6 text-gray-300 dark:text-gray-700" size={64} />
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">No encontramos artículos</h3>
                  <p className="text-gray-500 mb-8">No hay resultados para esta categoría en este momento.</p>
                  <button 
                    onClick={() => setCategoriaActiva('')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all"
                  >
                    Mostrar todos los artículos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Blog;