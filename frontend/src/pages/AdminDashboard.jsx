import { useState, useEffect } from 'react';
import { 
  Plus, X, Trash2, Edit3, 
  FileText, Layout, Globe, AlertCircle, Loader2
} from 'lucide-react';
import BlogEditor from './BlogEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [error, setError] = useState(null);

  // Función para convertir links de Drive a directos
  const getDirectDriveUrl = (url) => {
    if (!url || !url.includes('drive.google.com')) return url;
    const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
    const fileId = match ? match[1] : null;
    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : url;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${API_URL}/api/posts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : (data.results || []));
      } else if (response.status === 401) {
        setError("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      } else {
        setError("No se pudieron cargar los artículos.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("¿Estás seguro de eliminar este artículo?")) return;
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_URL}/api/posts/${slug}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchPosts();
    } catch (err) {
      alert("Error de red.");
    }
  };

  const handleEditClick = (post) => {
    setPostToEdit(post);
    setShowEditor(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic">
              ADMIN_BLOG<span className="text-blue-600">_PRO</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Gestión de contenido profesional</p>
          </div>
          
          <button 
            onClick={() => {
              if(showEditor) setShowEditor(false);
              else { setPostToEdit(null); setShowEditor(true); }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
              showEditor ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'
            }`}
          >
            {showEditor ? <><X size={20}/> Cancelar</> : <><Plus size={20}/> Nuevo Artículo</>}
          </button>
        </header>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-2xl flex items-center gap-3 text-red-400 mb-8">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {showEditor ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BlogEditor 
              postToEdit={postToEdit} 
              onSuccess={() => { setShowEditor(false); fetchPosts(); }} 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-500 mb-6 font-bold text-xs uppercase tracking-widest px-2">
              <Layout size={14} /> Artículos Publicados ({posts.length})
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-medium italic">Sincronizando...</p>
              </div>
            ) : (
              <div className="grid gap-3 w-full">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="group bg-gray-900/40 border border-gray-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 w-full overflow-hidden transition-all hover:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center gap-5 w-full min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700">
                        {post.imagen ? (
                          <img src={getDirectDriveUrl(post.imagen)} className="w-full h-full object-cover" alt="" 
                               onError={(e) => e.target.src='https://via.placeholder.com/100?text=Error'} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600"><FileText size={24}/></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg truncate w-full pr-4">{post.titulo}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-blue-500">{post.categoria}</span>
                          <span className="text-gray-600">•</span>
                          <span className={post.activo ? "text-green-500" : "text-yellow-500"}>
                            {post.activo ? 'Publicado' : 'Borrador'}
                          </span>
                          <span className="text-gray-600 truncate max-w-[150px] italic lowercase">
                            <Globe size={10} className="inline mr-1"/>{post.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto shrink-0 border-t border-gray-800 pt-4 md:pt-0 md:border-none">
                      <button onClick={() => handleEditClick(post)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-blue-900/40 hover:text-blue-400 rounded-xl transition-all font-bold text-sm">
                        <Edit3 size={16} /> Editar
                      </button>
                      <button onClick={() => handleDelete(post.slug)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-900/40 hover:text-red-400 rounded-xl transition-all font-bold text-sm">
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}

                {posts.length === 0 && !error && (
                  <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-3xl">
                    <FileText className="mx-auto mb-4 text-gray-700" size={48} />
                    <h3 className="text-xl font-bold text-gray-400">Sin artículos</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;