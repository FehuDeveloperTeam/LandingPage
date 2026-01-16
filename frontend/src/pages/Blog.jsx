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

  // Limpiador de URLs específico para ImgBB
  const getImgBBUrl = (url) => {
    if (!url) return '';
    // Nos aseguramos de que use HTTPS y eliminamos espacios
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
          setPosts(Array.isArray(data) ? data : (data.results || []))
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
    <PageLayout>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* ... (Header y Filtros se mantienen igual) ... */}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : (
            <>
              {/* POST DESTACADO */}
              {destacado && !categoriaActiva && (
                <Link to={`/blog/${destacado.slug}`} className="block mb-16 group">
                  <div className="overflow-hidden rounded-[32px] bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 shadow-2xl">
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-[300px] md:h-[450px] bg-gray-200 dark:bg-gray-800">
                        <img 
                          src={getImgBBUrl(destacado.imagen)} 
                          className="absolute inset-0 w-full h-full object-cover" 
                          alt={destacado.titulo}
                          // IMPORTANTE: Evita que ImgBB bloquee la carga desde Railway
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">{destacado.titulo}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-6 line-clamp-3">{destacado.resumen}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* LISTADO DE POSTS */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(categoriaActiva ? posts : otrosPosts).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <article className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border dark:border-gray-800 hover:shadow-xl transition-all">
                      <div className="relative h-56 bg-gray-200 dark:bg-gray-800">
                        <img 
                          src={getImgBBUrl(post.imagen)} 
                          className="w-full h-full object-cover" 
                          alt={post.titulo}
                          // IMPORTANTE: Evita que ImgBB bloquee la carga desde Railway
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.titulo}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-3">{post.resumen}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Blog;