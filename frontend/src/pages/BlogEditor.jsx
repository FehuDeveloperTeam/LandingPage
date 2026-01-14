import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import { 
  Bold, Italic, List, ListOrdered, Heading2, 
  Quote, Undo, Redo, Save, Image as ImageIcon,
  Search, Link as LinkIcon, FileText, CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Barra de herramientas de Tiptap (Sin emojis)
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btn = "p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ";
  const active = "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive('bold') ? active : ''}`}><Bold size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive('italic') ? active : ''}`}><Italic size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : ''}`}><Heading2 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive('bulletList') ? active : ''}`}><List size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive('orderedList') ? active : ''}`}><ListOrdered size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive('blockquote') ? active : ''}`}><Quote size={18}/></button>
      <div className="w-px h-6 bg-gray-400 dark:bg-gray-600 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn}><Undo size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn}><Redo size={18}/></button>
    </div>
  );
};

const BlogEditor = ({ postToEdit = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
    titulo: postToEdit?.titulo || '',
    resumen: postToEdit?.resumen || '',
    categoria: postToEdit?.categoria || 'tecnologia',
    activo: postToEdit?.activo ?? true,
    meta_titulo: postToEdit?.meta_titulo || '',
    meta_descripcion: postToEdit?.meta_descripcion || '',
    fuentes: postToEdit?.fuentes || '',
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: postToEdit?.contenido || '<p>Escribe aquí tu artículo profesional...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[350px] focus:outline-none border-none',
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('contenido', editor.getHTML()); // Capturamos el HTML de Tiptap
    if (imagen) data.append('imagen_archivo', imagen); // Por si usas FileField en Django

    const token = localStorage.getItem('access_token');

    try {
      const url = postToEdit ? `${API_URL}/api/posts/${postToEdit.slug}/` : `${API_URL}/api/posts/`;
      const response = await fetch(url, {
        method: postToEdit ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errData = await response.json();
        alert("Error al guardar: " + JSON.stringify(errData));
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Cabecera del Editor */}
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
        <FileText size={24} />
        <h2 className="text-xl font-bold">Editor de Artículos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Título del Post"
          className="p-3 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.titulo}
          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          required
        />
        <select
          className="p-3 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 outline-none"
          value={formData.categoria}
          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
        >
          <option value="desarrollo">Desarrollo</option>
          <option value="tecnologia">Tecnología</option>
          <option value="ia">Inteligencia Artificial</option>
          <option value="tutorial">Tutorial</option>
        </select>
      </div>

      <textarea
        placeholder="Breve resumen para la tarjeta del blog..."
        className="w-full p-3 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 h-20 outline-none"
        value={formData.resumen}
        onChange={(e) => setFormData({...formData, resumen: e.target.value})}
      />

      {/* Tiptap Editor */}
      <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      {/* SEO y Metadatos */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm uppercase">
          <Search size={16} /> Configuración SEO
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Meta Título (SEO)"
            className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            value={formData.meta_titulo}
            onChange={(e) => setFormData({...formData, meta_titulo: e.target.value})}
          />
          <input
            placeholder="Meta Descripción"
            className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
            value={formData.meta_descripcion}
            onChange={(e) => setFormData({...formData, meta_descripcion: e.target.value})}
          />
        </div>
      </div>

      {/* Bibliografía */}
      <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 space-y-2">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm uppercase">
          <LinkIcon size={16} /> Fuentes y Bibliografía
        </div>
        <textarea
          placeholder="Lista de links o libros consultados..."
          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm h-24 outline-none"
          value={formData.fuentes}
          onChange={(e) => setFormData({...formData, fuentes: e.target.value})}
        />
      </div>

      <div className="flex items-center gap-2 px-2">
        <input
          type="checkbox"
          id="activo"
          className="w-5 h-5 accent-blue-600"
          checked={formData.activo}
          onChange={(e) => setFormData({...formData, activo: e.target.checked})}
        />
        <label htmlFor="activo" className="font-medium text-gray-700 dark:text-gray-300">Publicar artículo inmediatamente</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
      >
        <Save size={20} />
        {loading ? 'Guardando cambios...' : 'Guardar Artículo Profesional'}
      </button>
    </form>
  );
};

export default BlogEditor;