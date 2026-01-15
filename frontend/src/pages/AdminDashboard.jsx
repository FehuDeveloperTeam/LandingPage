import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Quote, Undo, Redo, Save, Plus, X, Trash2, Search, Link as LinkIcon 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Componente para la Barra de Herramientas del Editor
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btn = "p-2 rounded hover:bg-gray-700 transition-colors ";
  const active = "bg-blue-600 text-white";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-800 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive('bold') ? active : ''}`}><Bold size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive('italic') ? active : ''}`}><Italic size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btn} ${editor.isActive('heading', { level: 1 }) ? active : ''}`}><Heading1 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : ''}`}><Heading2 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive('bulletList') ? active : ''}`}><List size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive('orderedList') ? active : ''}`}><ListOrdered size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive('blockquote') ? active : ''}`}><Quote size={18}/></button>
      <div className="w-px h-6 bg-gray-600 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn}><Undo size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn}><Redo size={18}/></button>
    </div>
  );
};

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${API_URL}/api/posts/`, {
      headers: {
        'Authorization': `Bearer ${token}` // Crucial para evitar el error 401
      }
    });
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    }
  } catch (error) {
    console.error("Error cargando posts para administración:", error);
  }
};
  
  const [formData, setFormData] = useState({
    titulo: '', imagen: '', categoria: 'tecnologia',
    meta_titulo: '', meta_descripcion: '', fuentes: ''
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Empieza a escribir tu historia profesional...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-4 min-h-[300px] focus:outline-none text-gray-200',
      },
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    const postData = {
      ...formData,
      contenido: editor.getHTML(), // Tiptap genera HTML limpio
      slug: formData.titulo.toLowerCase().trim().replace(/[\s.]+/g, '-').replace(/[^\w-]+/g, ''),
      activo: true,
      publicado: true
    };

    try {
      const response = await fetch(`${API_URL}/api/posts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        alert("Artículo publicado");
        setShowEditor(false);
        // fetchPosts()...
      }
    } catch (err) { alert("Error de red"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter italic">ADMIN_BLOG_PRO</h1>
          <button onClick={() => setShowEditor(!showEditor)} className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all">
            {showEditor ? <><X size={20}/> CERRAR</> : <><Plus size={20}/> NUEVO POST</>}
          </button>
        </div>

        <div className="grid gap-4 mt-8">
  {posts.map((post) => (
    <div key={post.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
      <div>
        <h3 className="font-bold text-white">{post.titulo}</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest">{post.categoria}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => handleEdit(post)} 
          className="p-2 hover:bg-gray-800 rounded text-blue-400"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => handleDelete(post.slug)} 
          className="p-2 hover:bg-gray-800 rounded text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  ))}
</div>

        {showEditor && (
          <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Título impactante" className="bg-transparent border-b border-gray-800 text-2xl p-2 outline-none focus:border-blue-500 transition-colors" onChange={e => setFormData({...formData, titulo: e.target.value})} />
              <input placeholder="URL Imagen Destacada" className="bg-transparent border-b border-gray-700 p-2 outline-none focus:border-blue-500" onChange={e => setFormData({...formData, imagen: e.target.value})} />
            </div>

            {/* EDITOR TIPTAP */}
            <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/50">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />
            </div>

            {/* SEO & METADATOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900/30 p-6 rounded-2xl border border-gray-800">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase"><Search size={14}/> SEO Engine</div>
                <input placeholder="Meta Título" className="w-full bg-gray-800 p-2 rounded-lg text-sm border border-transparent focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, meta_titulo: e.target.value})} />
                <textarea placeholder="Meta Descripción para buscadores" className="w-full bg-gray-800 p-2 rounded-lg text-sm h-20 outline-none" onChange={e => setFormData({...formData, meta_descripcion: e.target.value})} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase"><LinkIcon size={14}/> Bibliografía</div>
                <textarea placeholder="Enlaces de referencia (uno por línea)..." className="w-full bg-gray-800 p-2 rounded-lg text-sm h-32 outline-none" onChange={e => setFormData({...formData, fuentes: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 py-4 rounded-xl font-black text-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
              <Save size={24}/> {loading ? 'PROCESANDO...' : 'PUBLICAR AHORA'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;