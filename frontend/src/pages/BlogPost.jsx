import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import DOMPurify from 'dompurify'
import { Calendar, Tag, Share2, ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
    window.scrollTo(0, 0)
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const url = `${API_URL}/api/posts/slug/${slug}/`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error('Error cargando post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    )
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
          <Link to="/blog" className="text-blue-600 mt-4 inline-block hover:underline">Volver al blog</Link>
        </div>
      </PageLayout>
    )
  }

  const shareUrl = window.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titulo)}&url=${encodeURIComponent(shareUrl)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  return (
    <PageLayout>
      {/* SEO Dinámico con los nuevos campos del Backend */}
      <SEO 
        title={post.meta_titulo || post.titulo} 
        description={post.meta_descripcion || post.resumen}
        image={post.imagen}
        article={true}
      />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la galería</span>
        </Link>

        <header className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
              {post.categoria}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.fecha_creacion).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            {post.titulo}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-blue-500 pl-6">
            {post.resumen}
          </p>
        </header>

        {post.imagen && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
            <img src={post.imagen} alt={post.titulo} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <Card className="p-6 md:p-10 mb-10 border-none bg-white dark:bg-gray-900 shadow-xl">
          {/* RENDERIZADO PROFESIONAL DE TIPTAP HTML */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none 
                       prose-headings:font-bold prose-headings:tracking-tight
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-2xl prose-blockquote:border-blue-500
                       prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenido) }} 
          />

          {/* Sección de Bibliografía / Fuentes */}
          {post.fuentes && (
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <LinkIcon size={16} /> Fuentes y Bibliografía
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {post.fuentes}
              </div>
            </div>
          )}
        </Card>

        {/* Tags y Compartir */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Compartir</span>
            <div className="flex gap-2">
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white rounded-full transition-all"
              >
                <Share2 size={18} />
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-700 hover:text-white rounded-full transition-all"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}

export default BlogPost