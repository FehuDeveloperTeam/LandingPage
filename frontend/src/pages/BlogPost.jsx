import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Linkedin, Twitter, Share, Link as LinkIcon, 
  ChevronDown, ChevronUp, Loader2, Calendar, BookOpen, 
  Clock, Hash 
} from 'lucide-react';
import DOMPurify from 'dompurify';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const getDirectUrl = (url) => {
    if (!url) return '';
    if (url.includes('i.ibb.co')) return url;
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

  if (loading) return (
    <PageLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 animate-pulse font-medium">Cargando artículo...</p>
      </div>
    </PageLayout>
  );

  if (!post) return (
    <PageLayout titulo="404" subtitulo="Post no encontrado">
      <div className="text-center py-20">
        <Link to="/blog" className="text-blue-600 font-bold hover:underline">Volver al Blog</Link>
      </div>
    </PageLayout>
  );

  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <PageLayout>
      <SEO 
        title={`${post.titulo} | Blog Fehu Developers`} 
        description={post.resumen}
      />
      
      <article className="max-w-4xl mx-auto py-4">
        
        {/* Navegación superior */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-12 font-bold text-xs tracking-widest uppercase transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al blog
        </Link>

        {/* Header del Post */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
              <Hash size={14} />
              <span className="uppercase text-[10px] font-black tracking-tighter">{post.categoria || 'Tecnología'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(post.fecha_creacion).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>5 min lectura</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-10 leading-[1.1] text-gray-900 dark:text-white tracking-tighter">
            {post.titulo}
          </h1>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[42px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <p className="relative text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-[40px] border border-gray-100 dark:border-white/5 shadow-inner">
              {post.resumen}
            </p>
          </div>
        </header>

        {/* Imagen Destacada */}
        {post.imagen && (
          <div className="mb-16 rounded-[48px] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform -rotate-1">
            <img 
              src={getDirectUrl(post.imagen)} 
              className="w-full h-auto object-cover" 
              alt={post.titulo}
              onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600?text=Error+Imagen'}
            />
          </div>
        )}

        {/* Contenido Principal */}
        <div className="relative">
          <div 
            className={`prose prose-lg md:prose-xl max-w-none dark:prose-invert transition-all duration-1000 overflow-hidden ${
              !isExpanded ? 'max-h-[600px] blur-sm select-none pointer-events-none' : 'max-h-none'
            } prose-headings:font-black prose-headings:tracking-tighter prose-a:text-blue-600 dark:prose-a:text-blue-400`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contenido) }} 
          />
          
          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-gray-50 via-white/95 dark:from-gray-950 dark:via-gray-900/95 to-transparent flex items-end justify-center pb-12">
              <button 
                onClick={() => setIsExpanded(true)}
                className="group flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-black text-sm hover:scale-105 transition-all shadow-2xl shadow-blue-500/20"
              >
                <BookOpen size={18} />
                DESBLOQUEAR LECTURA COMPLETA
                <ChevronDown size={18} className="animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* Footer del Post: Compartir y Fuentes */}
        <footer className="mt-20 space-y-12">
          
          {/* Compartir */}
          <div className="flex flex-col items-center gap-6 py-12 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Difundir Conocimiento</span>
            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={22} />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, color: 'hover:text-blue-600' },
                { icon: <Twitter size={22} />, url: `https://twitter.com/intent/tweet?url=${shareUrl}`, color: 'hover:text-sky-400' },
                { icon: <Share size={22} />, onClick: () => navigator.share({url: window.location.href}), color: 'hover:text-emerald-500' }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={item.onClick || (() => window.open(item.url, '_blank'))}
                  className={`p-5 bg-white dark:bg-gray-800 rounded-2xl text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1 ${item.color} hover:shadow-lg`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Fuentes */}
          {post.fuentes && (
            <div className="p-10 bg-gray-900/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                <LinkIcon size={80} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2">
                <LinkIcon size={14} /> Fuentes
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed relative z-10 font-medium">
                {post.fuentes}
              </div>
            </div>
          )}
        </footer>
      </article>
    </PageLayout>
  );
};

export default BlogPost;