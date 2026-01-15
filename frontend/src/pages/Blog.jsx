import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import SEO from '../components/SEO'
import { LayoutGrid, Cpu, Code2, BookOpen, Newspaper, Star, ArrowRight, Search, Clock, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('')

  // FUNCIÓN DE IMAGEN ULTRA-SEGURA
  const getDirectUrl = (url) => {
    if (!url) return '';
    // Limpiar espacios y forzar HTTPS
    let cleanUrl = url.trim().replace('http://', 'https://');

    if (cleanUrl.includes('i.ibb.co')) return cleanUrl;
    
    if (cleanUrl.includes('drive.google.com')) {
      const match = cleanUrl.match(/\/d\/(.+?)\/(view|edit|share)/) || cleanUrl.match(/id=(.+?)(&|$)/);
      return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : cleanUrl;
    }
    return cleanUrl;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const url = categoriaActiva 
          ? `${API_URL}/api/posts/?categoria=${categoriaActiva}`
          : `${API_URL}/api/posts/`;
        const response = await fetch(url)
        const data = await response.json()
        setPosts(Array.isArray(data) ? data : (data.results || []))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchPosts()
  }, [categoriaActiva])

  const destacado = posts.find(p => p.destacado) || posts[0]
  const otrosPosts = destacado ? posts.filter(p => p.id !== destacado.id) : posts

  return (
    <PageLayout>
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* ... Categorías iguales ... */}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
          ) : (
            <>
              {/* POST DESTACADO CON ALTURA FORZADA */}
              {destacado && !categoriaActiva && (
                <Link to={`/blog/${destacado.slug}`} className="block mb-16">
                  <div className="rounded-[32px] overflow-hidden bg-gray-100 dark:bg-gray-900 border dark:border-gray-800">
                    <div className="grid md:grid-cols-2">
                      {/* AQUÍ: h-[400px] obligatorio para que no colapse */}
                      <div className="h-[300px] md:h-[450px] w-full relative">
                        <img 
                          src={getDirectUrl(destacado.imagen)} 
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover block"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-8">
                        <h2 className="text-3xl font-black dark:text-white">{destacado.titulo}</h2>
                        <p className="mt-4 text-gray-500">{destacado.resumen}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* GRILLA CON ALTURA FORZADA */}
              <div className="grid gap-8 md:grid-cols-3">
                {(categoriaActiva ? posts : otrosPosts).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <article className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border dark:border-gray-800">
                      {/* AQUÍ: h-56 obligatorio */}
                      <div className="h-56 w-full relative bg-gray-200">
                        <img 
                          src={getDirectUrl(post.imagen)} 
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover block"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold dark:text-white">{post.titulo}</h3>
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