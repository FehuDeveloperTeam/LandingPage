import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Card from '../components/Card'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const CATEGORIAS = [
  { id: '', nombre: 'Todos', color: 'gray' },
  { id: 'desarrollo', nombre: 'Desarrollo', color: 'blue' },
  { id: 'tecnologia', nombre: 'Tecnología', color: 'purple' },
  { id: 'proyecto', nombre: 'Proyecto', color: 'green' },
  { id: 'tutorial', nombre: 'Tutorial', color: 'orange' },
  { id: 'noticia', nombre: 'Noticia', color: 'red' },
]

const ESTADOS = {
  idea: { label: 'Idea', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '💡' },
  desarrollo: { label: 'En Desarrollo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: '🔨' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '✅' },
  publicado: { label: 'Publicado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: '📝' },
}

function BlogCard({ post }) {
  const estado = ESTADOS[post.estado] || ESTADOS.publicado
  const fecha = new Date(post.fecha_creacion).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="h-full overflow-hidden group cursor-pointer">
        {/* Imagen */}
        {post.imagen ? (
          <div className="h-48 overflow-hidden">
            <img 
              src={post.imagen} 
              alt={post.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-6xl">{estado.icon}</span>
          </div>
        )}

        {/* Contenido */}
        <div className="p-5">
          {/* Categoria y estado */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${estado.color}`}>
              {estado.icon} {estado.label}
            </span>
            <span className="text-xs text-gray-500">{post.categoria}</span>
          </div>

          {/* Titulo */}
          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {post.titulo}
          </h3>

          {/* Resumen */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {post.resumen}
          </p>

          {/* Tags y fecha */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {post.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">{fecha}</span>
          </div>
        </div>

        {/* Badge destacado */}
        {post.destacado && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
            ⭐ Destacado
          </div>
        )}
      </Card>
    </Link>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [destacado, setDestacado] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [categoriaActiva])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoriaActiva) params.append('categoria', categoriaActiva)
      
      const response = await fetch(`${API_URL}/api/posts/?${params}`)
      const data = await response.json()
      
      // Separar destacado del resto
      const destacados = data.filter(p => p.destacado)
      const resto = data.filter(p => !p.destacado)
      
      setDestacado(destacados[0] || null)
      setPosts(resto)
    } catch (error) {
      console.error('Error cargando posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      titulo="Blog"
      subtitulo="Ideas, proyectos y aprendizajes en el mundo del desarrollo"
    >
      <SEO 
        title="Blog"
        description="Blog de desarrollo: ideas, proyectos, tutoriales y noticias sobre tecnologia, programacion y desarrollo web."
        url="/blog"
      />

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              categoriaActiva === cat.id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Post destacado */}
          {destacado && !categoriaActiva && (
            <Link to={`/blog/${destacado.slug}`} className="block mb-8">
              <Card className="overflow-hidden group">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Imagen */}
                  <div className="h-64 md:h-80 overflow-hidden">
                    {destacado.imagen ? (
                      <img 
                        src={destacado.imagen} 
                        alt={destacado.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-8xl">📝</span>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                        ⭐ Destacado
                      </span>
                      <span className="text-sm text-gray-500">{destacado.categoria}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {destacado.titulo}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {destacado.resumen}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {destacado.tags?.map((tag, i) => (
                        <span key={i} className="text-sm text-blue-600 dark:text-blue-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Grid de posts */}
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-6xl mb-4">📝</p>
              <p>No hay publicaciones en esta categoria</p>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}

export default Blog