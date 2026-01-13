import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagenUrl, setImagenUrl] = useState(''); 
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
      imagen: imagenUrl, 
      categoria,
      // Generamos el resumen eliminando etiquetas si las hubiera y limitando a 150 caracteres
      resumen: contenido.substring(0, 150), 
      slug: titulo.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      publicado: true,
      activo: true // Aseguramos que el post esté activo según tu modelo de Django
    };

    try {
      console.log('Token:', token);
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
          <label className="block font-medium">Título del Post</label>
          <input 
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Escribe el título aquí..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <label className="block font-medium">URL de la Imagen</label>
          <input 
            type="url"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
          />
          
          <label className="block font-medium">Categoría</label>
          <select 
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="desarrollo">Desarrollo</option>
            <option value="tecnologia">Tecnología</option>
            <option value="tutorial">Tutorial</option>
            <option value="proyecto">Proyecto</option>
          </select>

          <label className="block font-medium">Contenido del Post</label>
          <textarea 
            className="w-full h-80 p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-black dark:text-white"
            placeholder="Escribe el cuerpo del post aquí..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? 'Publicando...' : 'Publicar Post en el Blog'}
          </button>
        </form>
      )}

      {/* Lista de posts existentes */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold mb-2">Posts publicados</h2>
        {posts.length === 0 && <p className="text-gray-500 italic">No hay posts todavía.</p>}
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded-xl flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="font-bold text-lg">{post.titulo}</span>
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">{post.categoria}</p>
            </div>
            <div className="flex gap-3">
              <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 px-3 py-1 rounded-md transition-colors">Editar</button>
              <button className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 px-3 py-1 rounded-md transition-colors">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;