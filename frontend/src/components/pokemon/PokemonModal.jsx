import { useEffect } from 'react'
import { 
  X, Zap, Shield, Swords, DollarSign, 
  Calendar, User, Fingerprint, ExternalLink 
} from 'lucide-react'

function PokemonModal({ card, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!card) return null

  const tcgPrices = card.prices?.tcgplayer || {}
  const cardmarketPrices = card.prices?.cardmarket || {}
  
  // Tasa de cambio aproximada
  const USD_TO_CLP = 980
  const EUR_TO_CLP = 1050

  const formatUSD = (price) => !price ? '-' : `$${Number(price).toFixed(2)}`
  const formatEUR = (price) => !price ? '-' : `€${Number(price).toFixed(2)}`
  const formatCLP = (price, rate) => {
    if (!price) return '-'
    const clp = Math.round(Number(price) * rate)
    return `$${clp.toLocaleString('es-CL')}`
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Overlay con desenfoque */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.3)] border border-white/20">
        
        {/* Botón de Cierre Premium */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-red-500 hover:scale-110 transition-all border border-gray-200 dark:border-white/10"
        >
          <X size={24} />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          
          {/* Columna Izquierda: Visual */}
          <div className="p-8 lg:p-12 flex flex-col items-center justify-start bg-gray-50 dark:bg-black/20 lg:sticky lg:top-0">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {card.images?.large ? (
                <img
                  src={card.images.large}
                  alt={card.name}
                  className="relative z-10 w-full max-w-[380px] h-auto rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-64 h-96 bg-gray-200 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center">
                  <Fingerprint size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Datos Rápidos debajo de la imagen */}
            <div className="mt-8 w-full max-w-[380px] grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 flex items-center gap-2">
                    <User size={12} /> Ilustrador
                  </p>
                  <p className="text-sm font-bold truncate">{card.artist || 'Desconocido'}</p>
               </div>
               <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 flex items-center gap-2">
                    <Fingerprint size={12} /> ID Carta
                  </p>
                  <p className="text-sm font-bold truncate">{card.id}</p>
               </div>
            </div>
          </div>

          {/* Columna Derecha: Información Técnica */}
          <div className="p-8 lg:p-12 space-y-10">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {card.set?.logo && <img src={card.set.logo} alt="Set Logo" className="h-10 object-contain" />}
                <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{card.set?.name}</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic uppercase mb-4">{card.name}</h2>
              <div className="flex flex-wrap gap-2">
                {card.types?.map((type) => (
                  <span key={type} className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    {type}
                  </span>
                ))}
                {card.hp && (
                  <span className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900/50">
                    HP {card.hp}
                  </span>
                )}
              </div>
            </div>

            {/* Habilidades y Ataques */}
            <div className="space-y-6">
              {card.abilities?.map((ability, i) => (
                <div key={i} className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-md">Habilidad</span>
                    <span className="font-black text-lg italic uppercase">{ability.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ability.effect}</p>
                </div>
              ))}

              {card.attacks?.map((attack, i) => (
                <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group hover:border-blue-500/30 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Swords size={18} className="text-blue-600" />
                      <span className="font-black text-xl italic uppercase tracking-tighter">{attack.name}</span>
                    </div>
                    {attack.damage && (
                      <span className="text-2xl font-black text-blue-600">{attack.damage}</span>
                    )}
                  </div>
                  {attack.effect && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{attack.effect}</p>}
                </div>
              ))}
            </div>

            {/* Debilidad/Resistencia */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100 dark:border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Debilidad</p>
                {card.weaknesses?.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 font-bold text-red-600">
                    <Shield size={14} /> {w.type} {w.value}
                  </div>
                )) || <span className="text-sm font-bold opacity-30">Ninguna</span>}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Resistencia</p>
                {card.resistances?.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 font-bold text-emerald-600">
                    <Shield size={14} /> {r.type} {r.value}
                  </div>
                )) || <span className="text-sm font-bold opacity-30">Ninguna</span>}
              </div>
            </div>

            {/* SECCIÓN DE PRECIOS EDITORIAL */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Análisis de Mercado</h3>
              </div>
              
              <div className="grid gap-4">
                {/* TCGPlayer Card */}
                {(tcgPrices.low || tcgPrices.market) && (
                  <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-white/10">
                    <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
                      <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">TCGPlayer (USD)</span>
                      {tcgPrices.updated && (
                        <div className="flex items-center gap-1 text-white/60 text-[9px] font-bold">
                          <Calendar size={10} /> {new Date(tcgPrices.updated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Market', val: tcgPrices.market, color: 'text-emerald-500' },
                        { label: 'Low', val: tcgPrices.low, color: 'text-gray-500' },
                        { label: 'Mid', val: tcgPrices.mid, color: 'text-gray-500' },
                        { label: 'High', val: tcgPrices.high, color: 'text-gray-500' }
                      ].map((p, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-gray-400">{p.label}</p>
                          <p className={`text-lg font-black tracking-tighter ${p.color}`}>{formatUSD(p.val)}</p>
                          <p className="text-[10px] font-bold text-gray-400">{formatCLP(p.val, USD_TO_CLP)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 py-4 px-6 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                * Precios referenciales sujetos a volatilidad de divisas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal