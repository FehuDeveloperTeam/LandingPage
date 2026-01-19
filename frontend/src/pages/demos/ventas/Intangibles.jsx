import { useState } from 'react'
import DemoLayout from '../../../components/DemoLayout'
import { 
  Droplets, Sparkles, Calendar, FlaskConical, Sun, 
  MapPin, CheckCircle2, Navigation2, ArrowRight,
  ShieldCheck, Receipt, X, ArrowLeft // Añadido ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom' // Añadido Link

function Intangibles() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [comunaSeleccionada, setComunaSeleccionada] = useState(null)
  const [mostrarResumen, setMostrarResumen] = useState(false)

  // ... (Datos de servicios y comunas se mantienen igual)
  const servicios = [
    { id: 1, nombre: 'Limpieza Básica', descripcion: 'Limpieza superficial, retiro de hojas, medición pH y cloro', precio: 25000, icono: Droplets, color: 'text-blue-500' },
    { id: 2, nombre: 'Limpieza Completa', descripcion: 'Aspirado de fondo, cepillado paredes, limpieza filtros', precio: 45000, icono: Sparkles, color: 'text-cyan-500' },
    { id: 3, nombre: 'Mantención Mensual', descripcion: 'Visita semanal con químicos incluidos (4 visitas)', precio: 80000, icono: Calendar, color: 'text-indigo-500' },
    { id: 4, nombre: 'Agua Verde', descripcion: 'Tratamiento de choque para piscinas con algas', precio: 120000, icono: FlaskConical, color: 'text-emerald-500' },
    { id: 5, nombre: 'Apertura Pro', descripcion: 'Puesta a punto completa y revisión de equipos', precio: 150000, icono: Sun, color: 'text-amber-500' },
  ]

  const comunas = [
    { id: 1, nombre: 'Chillán', distancia: 0 },
    { id: 2, nombre: 'Chillán Viejo', distancia: 5 },
    { id: 3, nombre: 'Bulnes', distancia: 17 },
    { id: 5, nombre: 'San Carlos', distancia: 25 },
    { id: 7, nombre: 'Quillón', distancia: 30 },
    { id: 10, nombre: 'Pinto', distancia: 45 },
    { id: 11, nombre: 'Pemuco', distancia: 50 },
  ]

  const calcularTraslado = (distancia) => distancia <= 5 ? 0 : distancia * 600
  const formatoPrecio = (precio) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)

  const costoTraslado = comunaSeleccionada ? calcularTraslado(comunaSeleccionada.distancia) : 0
  const costoServicio = servicioSeleccionado ? servicioSeleccionado.precio : 0
  const costoTotal = costoServicio + costoTraslado

  const handleConfirmar = () => {
    alert('¡Cotización enviada! Un técnico de AquaClean te contactará en breve.')
    setServicioSeleccionado(null)
    setComunaSeleccionada(null)
    setMostrarResumen(false)
  }

  return (
    <DemoLayout tema="intangibles">
      {(tema) => (
        <div className="max-w-6xl mx-auto space-y-12 py-10 px-4"> {/* Reducido space-y de 20 a 12 */}
          
          {/* BOTÓN VOLVER (Añadido) */}
          <div className="flex justify-start">
            <Link to="/demos/ventas" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Ventas
            </Link>
          </div>

          {/* Hero Editorial */}
          <header className="text-center space-y-6">
            <div className="inline-flex p-4 bg-blue-600/10 rounded-3xl mb-4 animate-bounce">
              <Droplets size={48} className="text-blue-600" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              AquaClean<br/><span className="text-blue-600">Premium</span>
            </h1>
            {/* ... Resto del header igual */}
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto">
              Cuidamos tu descanso con estándares industriales. Cotiza tu mantenimiento en segundos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
                 <ShieldCheck size={14} className="text-blue-500" /> Garantía de Calidad
               </span>
               <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
                 <Navigation2 size={14} className="text-blue-500" /> Cobertura Regional
               </span>
            </div>
          </header>

          {/* ... Resto del componente se mantiene igual */}
          <div className="grid lg:grid-cols-3 gap-16">
            
            {/* Columna Izquierda: Pasos 1 y 2 */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Step 1: Services */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-xl shadow-blue-500/20">01</div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Selecciona el Plan</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {servicios.map((s) => {
                    const Icon = s.icono
                    const isSelected = servicioSeleccionado?.id === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => setServicioSeleccionado(s)}
                        className={`group p-6 rounded-[2rem] text-left transition-all border ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/30 -translate-y-1' 
                            : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-blue-500/50'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl w-fit mb-4 ${isSelected ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                          <Icon size={24} className={isSelected ? 'text-white' : s.color} />
                        </div>
                        <h3 className={`font-black uppercase italic tracking-tight mb-2 ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{s.nombre}</h3>
                        <p className={`text-xs font-medium leading-relaxed mb-4 ${isSelected ? 'text-blue-50' : 'text-gray-500'}`}>{s.descripcion}</p>
                        <p className={`text-xl font-black ${isSelected ? 'text-white' : 'text-blue-600'}`}>{formatoPrecio(s.precio)}</p>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Step 2: Location */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-xl shadow-blue-500/20">02</div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Ubicación del Servicio</h2>
                </div>
                
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {comunas.map((c) => {
                    const traslado = calcularTraslado(c.distancia)
                    const isSelected = comunaSeleccionada?.id === c.id
                    return (
                      <button
                        key={c.id}
                        onClick={() => setComunaSeleccionada(c)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl' 
                            : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">{c.nombre}</p>
                        <p className={`text-[9px] font-bold ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>{c.distancia} KM</p>
                        <p className={`mt-2 text-[10px] font-black ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                          {traslado === 0 ? 'SIN COSTO' : `+ ${formatoPrecio(traslado)}`}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Columna Derecha: Resumen (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-10 space-y-6">
                <div className="bg-gray-900 dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-gray-900 shadow-2xl overflow-hidden relative">
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 blur-[80px] opacity-20" />
                   
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-8">
                       <Receipt size={24} className="text-blue-500" />
                       <h3 className="text-xl font-black uppercase italic tracking-tighter">Tu Presupuesto</h3>
                     </div>

                     <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-start group">
                           <div>
                             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Servicio</p>
                             <p className="font-bold uppercase tracking-tight italic">{servicioSeleccionado?.nombre || 'No seleccionado'}</p>
                           </div>
                           <p className="font-bold">{formatoPrecio(costoServicio)}</p>
                        </div>

                        <div className="flex justify-between items-start">
                           <div>
                             <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Traslado</p>
                             <p className="font-bold uppercase tracking-tight italic">{comunaSeleccionada?.nombre || 'Pendiente'}</p>
                           </div>
                           <p className="font-bold">{costoTraslado === 0 ? '—' : formatoPrecio(costoTraslado)}</p>
                        </div>

                        <div className="pt-6 border-t border-white/10 dark:border-gray-900/10">
                           <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Total Estimado</p>
                           <p className="text-5xl font-black italic tracking-tighter">{formatoPrecio(costoTotal)}</p>
                        </div>
                     </div>

                     <button
                       disabled={!servicioSeleccionado || !comunaSeleccionada}
                       onClick={() => setMostrarResumen(true)}
                       className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale transition-all hover:bg-blue-700 active:scale-95"
                     >
                       Confirmar Reserva <ArrowRight size={16} />
                     </button>
                   </div>
                </div>

                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                  * Valores finales según estado de piscina.
                </p>
              </div>
            </div>
          </div>
          {/* ... */}
        </div>
      )}
    </DemoLayout>
  )
}
export default Intangibles