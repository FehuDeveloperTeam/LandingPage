import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../../components/PageLayout'
import PokemonCard from '../../components/pokemon/PokemonCard'
import PokemonFilters from '../../components/pokemon/PokemonFilters'
import PokemonModal from '../../components/pokemon/PokemonModal'
import SEO from '../../components/SEO'
import { ArrowLeft, Search, Sparkles, LayoutGrid, Info, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function Pokemon() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    set: '',
    types: '',
    rarity: ''
  })
  const [selectedCard, setSelectedCard] = useState(null)
  const [sets, setSets] = useState([])
  const [types, setTypes] = useState([])
  const [rarities, setRarities] = useState([])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [setsRes, typesRes, raritiesRes] = await Promise.all([
          fetch(`${API_URL}/api/pokemon/sets/`),
          fetch(`${API_URL}/api/pokemon/types/`),
          fetch(`${API_URL}/api/pokemon/rarities/`)
        ])
        setSets(await setsRes.json())
        setTypes(await typesRes.json())
        setRarities(await raritiesRes.json())
      } catch (error) {
        console.error('Error cargando filtros:', error)
      }
    }
    loadFilters()
  }, [])

  const searchCards = async () => {
    if (!search && !filters.set && !filters.types && !filters.rarity) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('name', search)
      if (filters.set) params.append('set', filters.set)
      if (filters.types) params.append('types', filters.types)
      if (filters.rarity) params.append('rarity', filters.rarity)

      const response = await fetch(`${API_URL}/api/pokemon/search/?${params}`)
      const data = await response.json()
      setCards(data.cards || [])
    } catch (error) {
      console.error('Error buscando cartas:', error)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    searchCards()
  }

  const loadCardDetail = async (cardId) => {
    try {
      const response = await fetch(`${API_URL}/api/pokemon/card/${cardId}/`)
      const data = await response.json()
      setSelectedCard(data)
    } catch (error) {
      console.error('Error cargando carta:', error)
    }
  }

  return (
    <PageLayout
      titulo="TCG Database"
      subtitulo="Explorador avanzado de cartas Pokémon con datos de mercado en tiempo real."
    >
      <SEO 
        title="Pokemon TCG Explorer | Fehu Developers"
        description="Analítica y búsqueda de cartas Pokémon TCG con conversión de precios a CLP."
        url="/demos/pokemon"
      />

      <div className="max-w-6xl mx-auto">
        {/* Botón Volver Refinado */}
        <Link 
          to="/herramientas" 
          className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 mb-10 transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver a Herramientas
        </Link>

        {/* Barra de Búsqueda Estilo Consola */}
        <div className="relative z-10 mb-12">
          <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre del Pokémon (ej: Umbreon, Gengar...)"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white dark:bg-gray-900 border-0 shadow-2xl focus:ring-2 focus:ring-blue-500/50 outline-none font-medium text-lg transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Sincronizando...' : 'Ejecutar Búsqueda'}
            </button>
          </form>

          {/* Filtros Integrados */}
          <div className="mt-4">
            <PokemonFilters
              filters={filters}
              setFilters={setFilters}
              sets={sets}
              types={types}
              rarities={rarities}
              onApply={() => searchCards()}
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-8">
          <AnimatePresence mode='wait'>
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col justify-center items-center py-32 gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Consultando API de TCGdex...</span>
              </motion.div>
            ) : cards.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <LayoutGrid size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">{cards.length} Resultados</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <PokemonCard
                        card={card}
                        onClick={() => loadCardDetail(card.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-32 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem]"
              >
                <div className="inline-flex p-6 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 mb-6">
                  <Info size={40} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Base de datos lista</h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm">
                  Utiliza los parámetros de búsqueda para filtrar por nombre, edición o rareza.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PokemonModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </PageLayout>
  )
}

export default Pokemon