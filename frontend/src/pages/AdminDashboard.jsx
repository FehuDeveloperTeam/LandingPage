import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagenUrl, setImagenUrl] = useState(''); // NUEVO: Estado para la URL de la imagen
  const [categoria, setCategoria] = useState('desarrollo');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error cargando posts:", error);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!titulo || !contenido) return alert("Rellena el título y el contenido");
    
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    const postData = {
      titulo,
      contenido, 
      imagen: imagenUrl, // ENVIAMOS LA URL: Asegúrate que en Django el campo se llame 'imagen'
      categoria,
      resumen: contenido.substring(0, 150).replace(/<[^>]*>?/gm, ''), 
      slug: titulo.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      publicado: true
    };

    try {
      const response = await fetch(`${API_URL}/api/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        alert("¡Post publicado con éxito!");
        // Limpiamos todo
        setTitulo('');
        setContenido('');
        setImagenUrl('');
        setShowEditor(false);
        fetchPosts();
      } else {
        const errorData = await response.json();
        alert("Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto dark:text-white">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Gestión de Blog</h1>
        <button 
          onClick={() => setShowEditor(!showEditor)}
          className={`${showEditor ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-2 rounded-lg font-bold transition-colors`}
        >
          {showEditor ? 'Cancelar' : '+ Nuevo Post'}
        </button>
      </div>

      {showEditor && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-12 space-y-4 text-black dark:text-white">
          <input 
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Título del post..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          {/* NUEVO: Campo para la URL de la imagen */}
          <input 
            type="url"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="URL de la imagen (ej: https://imgur.com/foto.jpg)"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
          />
          
          <select 
            className="w-full p-3 border rounded-lg dark:bg-gray-700"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="desarrollo">Desarrollo</option>
            <option value="tecnologia">Tecnología</option>
            <option value="tutorial">Tutorial</option>
            <option value="proyecto">Proyecto</option>
          </select>

          <div className="h-80 mb-16">
            <ReactQuill 
              theme="snow" 
              value={contenido} 
              onChange={setContenido} 
              className="h-full bg-white text-black rounded-b-lg"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Publicando...' : 'Publicar Post en el Blog'}
          </button>
        </form>
      )}

      {/* Lista de posts existentes */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold mb-2">Posts publicados</h2>
        {posts.length === 0 && <p className="text-gray-500">No hay posts todavía.</p>}
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded-xl flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
            <div>
              <span className="font-bold">{post.titulo}</span>
              <p className="text-xs text-gray-500 uppercase">{post.categoria}</p>
            </div>
            <div className="flex gap-3">
              <button className="text-blue-500 hover:text-blue-700 font-medium">Editar</button>
              <button className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;