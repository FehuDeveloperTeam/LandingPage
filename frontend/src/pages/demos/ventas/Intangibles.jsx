import { useState } from 'react'
import DemoLayout from '../../../components/DemoLayout'

function Intangibles() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [comunaSeleccionada, setComunaSeleccionada] = useState(null)
  const [mostrarResumen, setMostrarResumen] = useState(false)

  const servicios = [
    { id: 1, nombre: 'Limpieza Básica', descripcion: 'Limpieza superficial, retiro de hojas, medición pH y cloro', precio: 25000, icono: '🧹' },
    { id: 2, nombre: 'Limpieza Completa', descripcion: 'Aspirado de fondo, cepillado paredes, limpieza skimmer y filtros', precio: 45000, icono: '✨' },
    { id: 3, nombre: 'Mantención Mensual', descripcion: 'Visita semanal con limpieza y químicos incluidos (4 visitas)', precio: 80000, icono: '📅' },
    { id: 4, nombre: 'Recuperación Agua Verde', descripcion: 'Tratamiento completo para piscinas con algas', precio: 120000, icono: '🧪' },
    { id: 5, nombre: 'Apertura de Temporada', descripcion: 'Puesta a punto completa, revisión equipos, llenado y tratamiento', precio: 150000, icono: '☀️' },
  ]

  const comunas = [
    { id: 1, nombre: 'Chillán', distancia: 0 },
    { id: 2, nombre: 'Chillán Viejo', distancia: 5 },
    { id: 3, nombre: 'Bulnes', distancia: 17 },
    { id: 4, nombre: 'San Ignacio', distancia: 20 },
    { id: 5, nombre: 'San Carlos', distancia: 25 },
    { id: 6, nombre: 'Coihueco', distancia: 27 },
    { id: 7, nombre: 'Quillón', distancia: 30 },
    { id: 8, nombre: 'Yungay', distancia: 35 },
    { id: 9, nombre: 'El Carmen', distancia: 40 },
    { id: 10, nombre: 'Pinto', distancia: 45 },
    { id: 11, nombre: 'Pemuco', distancia: 50 },
  ]

  const calcularTraslado = (distancia) => {
    if (distancia <= 5) return 0
    return distancia * 300 * 2
  }

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const costoTraslado = comunaSeleccionada ? calcularTraslado(comunaSeleccionada.distancia) : 0
  const costoServicio = servicioSeleccionado ? servicioSeleccionado.precio : 0
  const costoTotal = costoServicio + costoTraslado

  const handleConfirmar = () => {
    alert('¡Solicitud enviada! Nos contactaremos contigo pronto.')
    setServicioSeleccionado(null)
    setComunaSeleccionada(null)
    setMostrarResumen(false)
  }

  return (
    <DemoLayout tema="intangibles">
      {(tema) => (
        <div className="space-y-16">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-4xl shadow-lg shadow-cyan-500/30 mb-2">
              🏊
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
              AquaClean Ñuble
            </h1>
            <p className={`${tema.textMuted} text-lg max-w-xl mx-auto`}>
              Servicios profesionales de limpieza y mantención de piscinas
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${tema.badge} rounded-full text-sm`}>
              📍 Operamos desde Chillán a toda la región
            </div>
          </header>

          {/* Paso 1: Servicios */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-full bg-gradient-to-r ${tema.gradient} text-white flex items-center justify-center font-bold shadow-lg`}>1</span>
              <h2 className="text-2xl font-bold">Selecciona un servicio</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  onClick={() => setServicioSeleccionado(servicio)}
                  className={`${tema.card} rounded-2xl p-6 cursor-pointer transition-all duration-300 ${tema.cardHover} ${
                    servicioSeleccionado?.id === servicio.id
                      ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                      : ''
                  }`}
                >
                  <div className="text-4xl mb-3">{servicio.icono}</div>
                  <h3 className="font-bold text-lg mb-2">{servicio.nombre}</h3>
                  <p className={`${tema.textMuted} text-sm mb-4`}>{servicio.descripcion}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
                    {formatoPrecio(servicio.precio)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Paso 2: Comunas */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-full bg-gradient-to-r ${tema.gradient} text-white flex items-center justify-center font-bold shadow-lg`}>2</span>
              <h2 className="text-2xl font-bold">Selecciona tu comuna</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {comunas.map((comuna) => {
                const traslado = calcularTraslado(comuna.distancia)
                return (
                  <div
                    key={comuna.id}
                    onClick={() => setComunaSeleccionada(comuna)}
                    className={`${tema.card} rounded-xl p-4 cursor-pointer transition-all duration-300 ${tema.cardHover} ${
                      comunaSeleccionada?.id === comuna.id
                        ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                        : ''
                    }`}
                  >
                    <p className="font-semibold">{comuna.nombre}</p>
                    <p className={`text-sm ${tema.textMuted}`}>{comuna.distancia} km</p>
                    <p className={`text-sm font-medium ${tema.textAccent}`}>
                      {traslado === 0 ? '✓ Sin costo traslado' : `+ ${formatoPrecio(traslado)}`}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Paso 3: Resumen */}
          {servicioSeleccionado && comunaSeleccionada && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-full bg-gradient-to-r ${tema.gradient} text-white flex items-center justify-center font-bold shadow-lg`}>3</span>
                <h2 className="text-2xl font-bold">Resumen del presupuesto</h2>
              </div>
              <div className={`${tema.card} rounded-2xl p-8 max-w-xl mx-auto`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{servicioSeleccionado.icono}</span>
                      {servicioSeleccionado.nombre}
                    </span>
                    <span className="font-semibold">{formatoPrecio(costoServicio)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">📍</span>
                      Traslado a {comunaSeleccionada.nombre}
                    </span>
                    <span className="font-semibold">{costoTraslado === 0 ? 'Gratis' : formatoPrecio(costoTraslado)}</span>
                  </div>
                  <div className={`flex justify-between items-center pt-4 border-t border-white/10 text-xl`}>
                    <span className="font-bold">Total</span>
                    <span className={`font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
                      {formatoPrecio(costoTotal)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMostrarResumen(true)}
                  className={`w-full mt-6 py-4 ${tema.btnPrimary} rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105`}
                >
                  Solicitar servicio
                </button>
              </div>
            </section>
          )}

          {/* Modal confirmación */}
          {mostrarResumen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMostrarResumen(false)} />
              <div className={`relative ${tema.card} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold">Confirmar solicitud</h3>
                </div>
                <div className={`space-y-3 mb-6 p-4 rounded-xl bg-white/5`}>
                  <p><strong>Servicio:</strong> {servicioSeleccionado?.nombre}</p>
                  <p><strong>Comuna:</strong> {comunaSeleccionada?.nombre}</p>
                  <p><strong>Distancia:</strong> {comunaSeleccionada?.distancia} km</p>
                  <div className="pt-3 border-t border-white/10">
                    <p className={`text-2xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
                      Total: {formatoPrecio(costoTotal)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMostrarResumen(false)}
                    className={`flex-1 py-3 ${tema.btnSecondary} rounded-xl font-medium transition-all hover:scale-105`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmar}
                    className={`flex-1 py-3 ${tema.btnPrimary} rounded-xl font-medium transition-all hover:scale-105`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DemoLayout>
  )
}

export default Intangibles