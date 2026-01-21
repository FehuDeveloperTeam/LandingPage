import React from 'react';
import { Zap, ShieldAlert, ExternalLink, TrendingUp } from 'lucide-react';

const BrainrotCard = ({ meme }) => {
  // Color dinámico según el status
  const getStatusColor = (status) => {
    const colors = {
      SIGMA: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
      SKIBIDI: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      COOKED: 'text-red-400 border-red-400/30 bg-red-400/10',
      OHIO: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
      ALPHA: 'text-amber-400 border-amber-400/30 bg-amber-400/10'
    };
    return colors[status] || 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  };

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Overlay de interferencia (Scanlines) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

      {/* Imagen con efecto Glitch al hover */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={meme.image} 
          alt={meme.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-black px-2 py-1 border ${getStatusColor(meme.status)} tracking-[0.2em]`}>
            {meme.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-black italic uppercase text-white group-hover:text-blue-500 transition-colors leading-none">
            {meme.name}
          </h3>
          <div className="text-right">
            <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-widest">Aura Level</span>
            <span className={`text-sm font-mono font-bold ${meme.aura > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {meme.aura > 0 ? `+${meme.aura}` : meme.aura}
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-[11px] leading-relaxed mb-6 font-medium line-clamp-3">
          {meme.description}
        </p>

        {/* Stats lúdicos */}
        <div className="mt-auto space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
              <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-500"/> Rizz Factor</span>
              <span>{meme.rizz}%</span>
            </div>
            <div className="h-[1px] bg-white/10 w-full">
              <div 
                className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] transition-all duration-1000" 
                style={{ width: `${meme.rizz}%` }} 
              />
            </div>
          </div>

          <a 
            href={meme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            <ExternalLink size={12} /> Analizar Lore
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrainrotCard;