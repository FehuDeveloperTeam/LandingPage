import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'
import { IconArrowRight } from '../components/Icons'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

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
      const url = API_URL + '/api/posts/slug/' + slug + '/'
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
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    )
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-gray-500 mb-6">El post que buscas no existe</p>
          <Link to="/blog" className="px-6 py-3 bg-gray-900 text-white rounded-xl">
            Volver al blog
          </Link>
        </div>
      </PageLayout>
    )
  }

  const fecha = new Date(post.fecha_creacion).toLocaleDateString('es-CL')
  const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.titulo) + '&url=' + encodeURIComponent('https://fehudevelopers.cl/blog/' + post.slug)
  const linkedinUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://fehudevelopers.cl/blog/' + post.slug)

  return (
    <PageLayout>
      <SEO title={post.titulo} description={post.resumen} url={'/blog/' + post.slug} />
      <article className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
          <IconArrowRight className="w-4 h-4 rotate-180" />
          Volver al blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">{post.categoria}</span>
            <span className="text-sm text-gray-500">{fecha}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.titulo}</h1>
          <p className="text-xl text-gray-600">{post.resumen}</p>
        </header>

        {post.imagen && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={post.imagen} alt={post.titulo} className="w-full h-auto" />
          </div>
        )}

        <Card className="p-6 md:p-8 mb-8">
          <div className="prose max-w-none">
            {post.contenido.split('\n').map((p, i) => (
              p.trim() ? <p key={i} className="mb-4 text-gray-700">{p}</p> : null
            ))}
          </div>
        </Card>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        <Card className="p-6 text-center">
          <p className="font-medium mb-4">Compartir</p>
          <div className="flex justify-center gap-3">
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Twitter</a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-700 text-white rounded-lg">LinkedIn</a>
          </div>
        </Card>
      </article>
    </PageLayout>
  )
}

export default BlogPost