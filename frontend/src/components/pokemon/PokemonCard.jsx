import { useState, useRef } from 'react'
import { Sparkles, Box } from 'lucide-react'

function PokemonCard({ card, onClick }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [showShine, setShowShine] = useState(false)
  const cardRef = useRef(null)

  // Efecto 3D y Brillo Holográfico
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calcular posición del mouse relativa a la carta
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Calcular rotación (máximo 15 grados)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setShowShine(false)
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowShine(true)}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer perspective-1000 group"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="relative transition-all duration-200 ease-out transform-style-3d overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-lg group-hover:shadow-2xl"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Capa de Brillo Holográfico (Foil Effect) */}
        {showShine && (
          <div 
            className="absolute inset-0 z-10 pointer-events-none opacity-50 mix-blend-color-dodge transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${50 + rotate.y * 2}% ${50 + rotate.x * 2}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
            }}
          />
        )}

        {/* Imagen de la Carta */}
        <div className="aspect-[2.5/3.5] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {card.image_small ? (
            <img
              src={card.image_small}
              alt={card.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Box size={32} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
            </div>
          )}

          {/* Badge de Rareza Estilo TCG */}
          {card.rarity && (
            <div className="absolute top-3 left-3 z-20">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl">
                <Sparkles size={10} className="text-amber-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                  {card.rarity}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Inferior */}
        <div className="p-4 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-black/20">
          <h3 className="font-black text-xs uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
            {card.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[80%] uppercase tracking-widest italic">
              {card.set_name}
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
      </div>
      
      {/* Sombra Dinámica */}
      <div 
        className="absolute -inset-1 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ transform: 'translateZ(-10px)' }}
      />
    </div>
  )
}

export default PokemonCard