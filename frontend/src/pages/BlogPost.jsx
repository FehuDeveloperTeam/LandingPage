import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import { IconArrowRight } from '../components/Icons'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const ESTADOS = {
  idea: { label: 'Idea', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '💡' },
  desarrollo: { label: 'En Desarrollo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: '🔨' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '✅' },
  publicado: { label: 'Publicado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: '📝' },
}

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/posts/slug/${slug}/`)
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

  const getTwitterUrl = () => {
    if (!post) return '#'
    const text = encodeURIComponent(post.titulo)
    const url = encodeURIComponent('https://fehudevelopers.cl/blog/' + post.slug)
    return 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url
  }

  const getLinkedInUrl = () => {
    if (!post) return '#'
    const url = encodeURIComponent('https://fehudevelopers.cl/blog/' + post.slug)
    return 'https://www.linkedin.com/sharing/share-offsite/?url=' + url
  }

  const copyLink = () => {
    if (!post) return
    const url = 'https://fehudevelopers.cl/blog/' + post.slug
    navigator.clipboard.writeText(url)
    alert('Link copiado!')
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (!post) {
    return (
      <PageLayout titulo="Post no encontrado">
        <div className="text-center py-20">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-gray-500 mb-6">El post que buscas no existe</p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl"
          >
            Volver al blog
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageLayout>
    )
  }

  const estado = ESTADOS[post.estado] || ESTADOS.publicado
  const fechaCreacion = new Date(post.fecha_creacion).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const fechaActualizacion = new Date(post.fecha_actualizacion).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <PageLayout>
      <SEO 
        title={post.titulo}
        description={post.resumen}
        url={'/blog/' + post.slug}
        image={post.imagen}
        type="article"
      />

      <article className="max-w-3xl mx-auto">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <span className="rotate-180">
            <IconArrowRight className="w-4 h-4" />
          </span>
          Volver al blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={'text-sm px-3 py-1 rounded-full ' + estado.color}>
              {estado.icon} {estado.label}
            </span>
            <span className="text-sm text-gray-500 capitalize">{post.categoria}</span>
            <span className="text-sm text-gray-500">{fechaCreacion}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.titulo}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400">
            {post.resumen}
          </p>
        </header>

        {post.imagen && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img 
              src={post.imagen} 
              alt={post.titulo}
              className="w-full h-auto"
            />
          </div>
        )}

        <Card className="p-6 md:p-8 mb-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.contenido.split('\n').map((parrafo, i) => {
              if (parrafo.trim()) {
                return (
                  <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                    {parrafo}
                  </p>
                )
              }
              return null
            })}
          </div>
        </Card>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-500">
            Ultima actualizacion: {fechaActualizacion}
          </p>
        </div>

        <Card className="p-6 mt-8 text-center">
          <p className="font-medium mb-4">¿Te gusto este post? Compartelo</p>
          <div className="flex justify-center gap-3">
            
              href={getTwitterUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Twitter
            </a>
            
              href={getLinkedInUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              LinkedIn
            </a>
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Copiar link
            </button>
          </div>
        </Card>
      </article>
    </PageLayout>
  )
}

export default BlogPost