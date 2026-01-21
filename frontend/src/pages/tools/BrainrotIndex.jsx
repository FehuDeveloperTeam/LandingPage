import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/PageLayout';
import SEO from '../../components/SEO';
import BrainrotCard from '../../components/BrainrotCard';
import { Skull, RefreshCcw, Search } from 'lucide-react';

const BrainrotIndex = () => {
  const [lore, setLore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLore = async () => {
    setLoading(true);
    try {
      // Ajusta esta URL a tu endpoint de Railway/Local
      const response = await fetch('https://landingpage-production-4175.up.railway.app/api/brainrot/');
      const data = await response.json();
      setLore(data);
    } catch (error) {
      console.error("Error cargando el lore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLore(); }, []);

  const filteredLore = lore.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout 
      titulo="Brainrot Lore Index" 
      subtitulo="Protocolo de vigilancia de memes y tendencias Alpha. Análisis de Aura en tiempo real."
      icono={<Skull className="w-8 h-8 text-purple-600" />}
    >
      <SEO title="Brainrot Lore Index | Fehu Developers" description="Enciclopedia de cultura de internet y memes." />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Barra de Herramientas */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="BUSCAR SUJETO O MEME..."
              className="w-full bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchLore}
            disabled={loading}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCcw size={14} className={loading ? 'animate-spin text-blue-500' : 'group-hover:rotate-180 transition-transform duration-500'} />
            Sincronizar Database
          </button>
        </div>

        {/* Grilla de Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Cargando Lore...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLore.map((meme, index) => (
              <BrainrotCard key={index} meme={meme} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BrainrotIndex;