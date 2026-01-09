import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardamos los tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        alert('Sesión iniciada');
        navigate('/admin/blog'); // Redirige a tu editor
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input 
          type="text" 
          placeholder="Usuario"
          className="w-full mb-3 p-2 border rounded"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
};

export default Login;