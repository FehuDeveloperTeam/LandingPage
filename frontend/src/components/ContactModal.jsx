import { useState } from 'react'

function ContactModal({ isOpen, onClose, servicioPreseleccionado = null }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    mensaje: servicioPreseleccionado 
      ? `Quiero información de ${servicioPreseleccionado}` 
      : ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [ticket, setTicket] = useState('')

  const generarTicket = () => {
    const fecha = new Date()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TKT-${fecha.getFullYear()}${(fecha.getMonth()+1).toString().padStart(2,'0')}${fecha.getDate().toString().padStart(2,'0')}-${random}`
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)

    const nuevoTicket = generarTicket()
    setTicket(nuevoTicket)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/contacto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticket: nuevoTicket
        })
      })

      if (response.ok) {
        setEnviado(true)
      } else {
        alert('Error al enviar. Intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión. Intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  const handleCerrar = () => {
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      mensaje: ''
    })
    setEnviado(false)
    setTicket('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleCerrar} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <button 
          onClick={handleCerrar}
          className="absolute top-4 right-4 text-2xl hover:opacity-70"
        >
          ×
        </button>

        {enviado ? (
          /* Mensaje de éxito */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">¡Solicitud recibida!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Hemos recibido tu consulta correctamente. Nuestro equipo se pondrá en contacto contigo a la brevedad.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Tu número de ticket: <strong>{ticket}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Revisa tu correo electrónico para más detalles.
            </p>
            <button
              onClick={handleCerrar}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:opacity-90 transition font-medium"
            >
              Aceptar
            </button>
          </div>
        ) : (
          /* Formulario */
          <>
            <h3 className="text-2xl font-bold mb-2">Contacto</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Completa el formulario y te contactaremos pronto.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="+56 9 1234 5678"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Correo electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detalles del proyecto *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe brevemente tu proyecto o consulta..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent focus:outline-none focus:border-gray-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:opacity-90 transition font-medium disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ContactModal