import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, List, ListOrdered, Heading2, 
  Quote, Undo, Redo, Save, Image as ImageIcon,
  Search, Link as LinkIcon, FileUp, Globe, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Barra de herramientas de Tiptap
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btn = "p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ";
  const active = "bg-blue-600 text-white";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-900 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive('bold') ? active : ''}`}><Bold size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive('italic') ? active : ''}`}><Italic size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : ''}`}><Heading2 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive('bulletList') ? active : ''}`}><List size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive('orderedList') ? active : ''}`}><ListOrdered size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive('blockquote') ? active : ''}`}><Quote size={18}/></button>
      <div className="w-px h-6 bg-gray-700 mx-2 self-center" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn}><Undo size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn}><Redo size={18}/></button>
    </div>
  );
};

const BlogEditor = ({ postToEdit = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: postToEdit?.titulo || '',
    resumen: postToEdit?.resumen || '',
    categoria: postToEdit?.categoria || 'tecnologia',
    activo: postToEdit?.activo ?? true,
    imagen: postToEdit?.imagen || '', // URL de Drive o Web
    meta_titulo: postToEdit?.meta_titulo || '',
    meta_descripcion: postToEdit?.meta_descripcion || '',
    fuentes: postToEdit?.fuentes || '',
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: postToEdit?.contenido || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none p-6 min-h-[400px] focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Agregamos todos los campos de texto
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Agregamos el contenido de Tiptap
    data.append('contenido', editor.getHTML());
    
    // Si hay un archivo físico seleccionado, lo priorizamos
    if (imagenArchivo) {
      data.append('imagen_archivo', imagenArchivo);
    }

    const token = localStorage.getItem('access_token');

    try {
      const url = postToEdit 
        ? `${API_URL}/api/posts/${postToEdit.slug}/` 
        : `${API_URL}/api/posts/`;
      
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
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-black pb-20 text-gray-200">
      
      {/* Campos Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">Título del Artículo</label>
          <input
            className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none transition-all text-xl font-bold"
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">Categoría</label>
          <select
            className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none appearance-none"
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
          >
            <option value="desarrollo">Desarrollo</option>
            <option value="tecnologia">Tecnología</option>
            <option value="ia">Inteligencia Artificial</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-gray-500">Resumen Ejecutivo</label>
        <textarea
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl h-24 focus:border-blue-500 outline-none transition-all resize-none"
          value={formData.resumen}
          onChange={(e) => setFormData({...formData, resumen: e.target.value})}
        />
      </div>

      {/* GESTIÓN DE IMAGEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-900/30 border border-gray-800 rounded-3xl">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
            <LinkIcon size={14}/> URL de Imagen (Google Drive/Web)
          </label>
          <input
            className="w-full p-3 bg-black border border-gray-700 rounded-xl text-sm focus:border-blue-500 outline-none"
            placeholder="Pegar enlace de imagen aquí..."
            value={formData.imagen}
            onChange={(e) => setFormData({...formData, imagen: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
            <FileUp size={14}/> O Subir Archivo
          </label>
          <input
            type="file"
            className="w-full p-2 bg-black border border-gray-700 rounded-xl text-xs"
            onChange={(e) => setImagenArchivo(e.target.files[0])}
          />
        </div>
      </div>

      {/* EDITOR TIPTAP */}
      <div className="border border-gray-800 rounded-3xl overflow-hidden bg-gray-900/20">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      {/* SEO Y FUENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-900/10 border border-blue-900/30 rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
            <Search size={16}/> Configuración SEO
          </h3>
          <input
            placeholder="Meta Título"
            className="w-full p-3 bg-black/40 border border-blue-900/20 rounded-xl text-sm outline-none focus:border-blue-500"
            value={formData.meta_titulo}
            onChange={(e) => setFormData({...formData, meta_titulo: e.target.value})}
          />
          <textarea
            placeholder="Meta Descripción"
            className="w-full p-3 bg-black/40 border border-blue-900/20 rounded-xl text-sm h-20 outline-none focus:border-blue-500"
            value={formData.meta_descripcion}
            onChange={(e) => setFormData({...formData, meta_descripcion: e.target.value})}
          />
        </div>

        <div className="p-6 bg-purple-900/10 border border-purple-900/30 rounded-3xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 flex items-center gap-2">
            <LinkIcon size={16}/> Fuentes y Bibliografía
          </h3>
          <textarea
            placeholder="Citas, links de referencia, etc..."
            className="w-full p-3 bg-black/40 border border-purple-900/20 rounded-xl text-sm h-[148px] outline-none focus:border-purple-500"
            value={formData.fuentes}
            onChange={(e) => setFormData({...formData, fuentes: e.target.value})}
          />
        </div>
      </div>

      {/* Publicar Switch */}
      <div className="flex items-center gap-3 px-2">
        <input
          type="checkbox"
          id="activo_editor"
          className="w-6 h-6 accent-blue-600 rounded-lg"
          checked={formData.activo}
          onChange={(e) => setFormData({...formData, activo: e.target.checked})}
        />
        <label htmlFor="activo_editor" className="font-bold text-gray-400 uppercase text-xs tracking-widest">
          Publicar artículo visible para todos
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={24}/>}
        {loading ? 'Sincronizando...' : 'GUARDAR CAMBIOS'}
      </button>

    </form>
  );
};

export default BlogEditor;