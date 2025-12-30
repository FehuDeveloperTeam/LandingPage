const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function getProyectos() {
  const res = await fetch(`${API_URL}/api/proyectos/`)
  if (!res.ok) throw new Error('Error al obtener proyectos')
  return res.json()
}

export async function getTecnologias() {
  const res = await fetch(`${API_URL}/api/tecnologias/`)
  if (!res.ok) throw new Error('Error al obtener tecnologías')
  return res.json()
}

export async function getProductos(search = '') {
  const url = search 
    ? `${API_URL}/api/productos/?search=${encodeURIComponent(search)}`
    : `${API_URL}/api/productos/`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function enviarContacto(datos) {
  const res = await fetch(`${API_URL}/api/contacto/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Error al enviar mensaje')
  }
  return res.json()
}