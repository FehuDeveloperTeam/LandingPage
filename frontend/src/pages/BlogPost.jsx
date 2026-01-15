import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Share, Link as LinkIcon, ChevronDown, ChevronUp, Loader2, Calendar } from 'lucide-react';
import DOMPurify from 'dompurify';
import PageLayout from '../components/PageLayout';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const getDirectUrl = (url) => {
    if (!url) return '';
    if (url.includes('i.ibb.co')) return url; // Soporte directo ImgBB
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      const fileId = match ? match[1] : null;
      return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
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
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-black"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!post) return <div className="text-center py-20 dark:text-white">Post no encontrado.</div>;

  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <PageLayout>
      {/* Fondo adaptativo para toda la página */}
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <article className="max-w-4xl mx-auto px-4 py-12">
          
          <Link to="/blog" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-10 font-bold text-xs tracking-widest uppercase">
            <ArrowLeft size={14} /> Volver al blog
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-gray-900 dark:text-white tracking-tighter">
              {post.titulo}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 italic border-l-4 border-blue-600 pl-6 mb-12">
              {post.resumen}
            </p>

            {post.imagen && (
              <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                <img 
                  src={getDirectUrl(post.imagen)} 
                  className="w-full h-auto" 
                  alt={post.titulo}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Error+Imagen'}
                />
              </div>
            )}
          </header>

          {/* CUERPO ADAPTATIVO: prose (claro) y dark:prose-invert (oscuro) */}
          <div className="relative">
            <div 
              className={`prose lg:prose-xl max-w-none dark:prose-invert transition-all duration-1000 overflow-hidden ${
                !isExpanded ? 'max-h-[500px]' : 'max-h-none'
              }`}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenido) }} 
            />
            
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 dark:from-black dark:via-black/80 to-transparent flex items-end justify-center">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="mb-4 px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                >
                  LEER ARTÍCULO COMPLETO
                </button>
              </div>
            )}
          </div>

          {/* COMPARTIR ADAPTATIVO */}
          <div className="mt-20 py-12 border-t border-gray-200 dark:border-gray-900 flex flex-col items-center gap-8">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Compartir</span>
            <div className="flex gap-6">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" 
                 className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all">
                <Linkedin size={24} />
              </a>
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`)}
                 className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-all">
                <Twitter size={24} />
              </button>
              <button onClick={() => navigator.share({url: window.location.href})}
                 className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-green-500 transition-all">
                <Share size={24} />
              </button>
            </div>
          </div>

          {/* FUENTES ADAPTATIVAS */}
          {post.fuentes && (
            <div className="mt-8 p-10 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-[32px]">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                <LinkIcon size={14} /> Fuentes
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {post.fuentes}
              </div>
            </div>
          )}
        </article>
      </div>
    </PageLayout>
  );
};

export default BlogPost;