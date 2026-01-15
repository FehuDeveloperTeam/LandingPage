import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Linkedin, 
  Twitter, 
  Share, 
  Link as LinkIcon, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Calendar,
  Clock
} from 'lucide-react';
import DOMPurify from 'dompurify';
import PageLayout from '../components/PageLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Utilidad para limpiar URLs de Drive/ImgBB
  const getDirectUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
    }
    return url;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/${slug}/`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShareGeneral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.titulo,
          text: post.resumen,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error compartiendo:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!post) return <div className="text-white text-center py-20">Post no encontrado.</div>;

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.titulo);

  return (
    <PageLayout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Navegación */}
        <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-10 font-bold text-xs tracking-widest transition-colors">
          <ArrowLeft size={14} /> VOLVER AL BLOG
        </Link>

        {/* Header del Post */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
              {post.categoria}
            </span>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <Calendar size={12} /> {new Date(post.fecha_creacion).toLocaleDateString()}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-white tracking-tighter">
            {post.titulo}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 italic border-l-4 border-blue-600 pl-6 mb-12 leading-relaxed">
            {post.resumen}
          </p>

          {post.imagen && (
            <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-800">
              <img 
                src={getDirectUrl(post.imagen)} 
                className="w-full h-auto object-cover" 
                alt={post.titulo}
                onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Error+Cargando+Imagen'}
              />
            </div>
          )}
        </header>

        {/* Cuerpo de la Noticia con Efecto Expandir */}
        <div className="relative">
          <div 
            className={`prose prose-invert prose-blue max-w-none transition-all duration-1000 ease-in-out overflow-hidden ${
              !isExpanded ? 'max-h-[500px]' : 'max-h-[none]'
            }`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenido) }} 
          />
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center">
              <button 
                onClick={() => setIsExpanded(true)}
                className="mb-4 flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-white/10"
              >
                <ChevronDown size={18} /> LEER ARTÍCULO COMPLETO
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <button 
            onClick={() => { setIsExpanded(false); window.scrollTo({top: 400, behavior: 'smooth'}); }}
            className="flex items-center gap-2 mx-auto mt-12 px-6 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-400 font-bold hover:text-white transition-all"
          >
            <ChevronUp size={18} /> MOSTRAR MENOS
          </button>
        )}

        {/* BOTONES DE COMPARTIR */}
        <div className="mt-20 py-12 border-t border-gray-900 flex flex-col items-center gap-8">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Compartir en redes</span>
          
          <div className="flex gap-6">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-16 h-16 bg-gray-950 border border-gray-800 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-500"
            >
              <Linkedin size={24} className="text-gray-500 group-hover:text-blue-500 transition-colors" />
            </a>

            <a 
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-16 h-16 bg-gray-950 border border-gray-800 rounded-2xl hover:border-white hover:bg-white/5 transition-all duration-500"
            >
              <Twitter size={24} className="text-gray-500 group-hover:text-white transition-colors" />
            </a>

            <button 
              onClick={handleShareGeneral}
              className="group flex items-center justify-center w-16 h-16 bg-gray-950 border border-gray-800 rounded-2xl hover:border-green-500 hover:bg-green-500/5 transition-all duration-500"
            >
              <Share size={24} className="text-gray-500 group-hover:text-green-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* SECCIÓN DE FUENTES */}
        {post.fuentes && (
          <div className="mt-8 p-10 bg-gray-900/20 border border-gray-800 rounded-[32px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
              <LinkIcon size={14} /> Fuentes
            </h3>
            <div className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed font-medium">
              {post.fuentes}
            </div>
          </div>
        )}
      </article>
    </PageLayout>
  );
};

export default BlogPost;