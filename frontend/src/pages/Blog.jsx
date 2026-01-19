import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import SEO from '../components/SEO'
import { 
  LayoutGrid, Cpu, Code2, BookOpen, Newspaper, Star, 
  ArrowRight, Search, Clock, Loader2 
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('')

  const getImgBBUrl = (url) => {
    if (!url || typeof url !== 'string') return 'https://via.placeholder.com/800x600?text=Sin+Imagen';
    return url.trim().replace('http://', 'https://');
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams();
        if (categoriaActiva) params.append('categoria', categoriaActiva);
        const url = `${API_URL}/api/posts/${params.toString() ? `?${params.toString()}` : ''}`;
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          const results = Array.isArray(data) ? data : (data.results || [])
          setPosts(results)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [categoriaActiva])

  const destacado = posts.find(p => p.destacado) || posts[0]
  const otrosPosts = destacado ? posts.filter(p => p.id !== destacado.id) : posts

  return (
    <PageLayout 
      titulo="Blog & Noticias" 
      subtitulo="Explora artículos sobre tecnología, desarrollo de software y las últimas tendencias de la industria."
      icono={<Newspaper className="w-8 h-8" />}
    >
      <SEO 
        title="Blog | Fehu Developers" 
        description="Artículos sobre desarrollo de software, tecnología y noticias."
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-500 animate-pulse">Cargando publicaciones...</p>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* POST DESTACADO */}
          {destacado && !categoriaActiva && (
            <Link to={`/blog/${destacado.slug}`} className="block group">
              <div className="overflow-hidden rounded-[32px] bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-2xl transition-all duration-500 group-hover:shadow-blue-500/10 group-hover:-translate-y-1">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-[300px] md:h-[450px] overflow-hidden">
                    <img 
                      src={getImgBBUrl(destacado.imagen || destacado.imagen_url)} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={destacado.titulo}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Error+de+Carga'; }}
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                        Destacado
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
                      <Clock size={16} />
                      <span>{new Date(destacado.fecha_creacion || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                      {destacado.titulo}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg line-clamp-3">
                      {destacado.resumen}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-gray-900 dark:text-white font-bold group-hover:gap-4 transition-all">
                      Leer más <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* GRID DE OTROS POSTS */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(categoriaActiva ? posts : otrosPosts).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <article className="flex flex-col h-full bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-[2rem] overflow-hidden border border-gray-200/50 dark:border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={getImgBBUrl(post.imagen || post.imagen_url)} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={post.titulo}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-3">
                      {post.categoria || 'Tecnología'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {post.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 line-clamp-3 leading-relaxed">
                      {post.resumen}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(post.fecha_creacion).toLocaleDateString()}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* MENSAJE VACÍO */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500">No se encontraron artículos en esta sección.</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}

export default Blog;