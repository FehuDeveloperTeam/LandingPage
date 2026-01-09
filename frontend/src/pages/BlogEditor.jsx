import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const BlogEditor = ({ postToEdit = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: postToEdit?.titulo || '',
    resumen: postToEdit?.resumen || '',
    categoria: postToEdit?.categoria || 'desarrollo',
    activo: postToEdit?.activo || false,
  });
  const [contenido, setContenido] = useState(postToEdit?.contenido || '');
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Preparamos el FormData (Necesario para archivos/imágenes)
    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('resumen', formData.resumen);
    data.append('contenido', contenido);
    data.append('categoria', formData.categoria);
    data.append('activo', formData.activo);
    if (imagen) data.append('imagen', imagen);

    const token = localStorage.getItem('access_token'); // Tu JWT guardado al hacer login

    try {
      const method = postToEdit ? 'PUT' : 'POST';
      const url = postToEdit 
        ? `${API_URL}/api/posts/${postToEdit.slug}/` 
        : `${API_URL}/api/posts/`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // NOTA: No definas Content-Type, el navegador lo hará por el FormData
        },
        body: data,
      });

      if (response.ok) {
        alert('¡Post guardado!');
        if (onSuccess) onSuccess();
      } else {
        const err = await response.json();
        console.error(err);
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{postToEdit ? 'Editar Post' : 'Nuevo Post'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título del post"
          className="w-full p-3 border rounded dark:bg-gray-700"
          value={formData.titulo}
          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          required
        />

        <textarea
          placeholder="Resumen corto (SEO)"
          className="w-full p-3 border rounded dark:bg-gray-700"
          value={formData.resumen}
          onChange={(e) => setFormData({...formData, resumen: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <select 
            className="p-3 border rounded dark:bg-gray-700"
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
          >
            <option value="desarrollo">Desarrollo</option>
            <option value="tecnologia">Tecnología</option>
            <option value="tutorial">Tutorial</option>
          </select>

          <input
            type="file"
            accept="image/*"
            className="p-2 border rounded"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo}
            onChange={(e) => setFormData({...formData, activo: e.target.checked})}
          />
          <label htmlFor="activo" className="font-medium">¿Publicar ahora? (Activo)</label>
        </div>

        <div className="h-80 mb-12">
          <ReactQuill 
            theme="snow" 
            value={contenido} 
            onChange={setContenido}
            className="h-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogEditor;