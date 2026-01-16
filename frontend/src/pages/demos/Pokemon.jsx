import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageLayout from '../../components/PageLayout'
import PokemonCard from '../../components/pokemon/PokemonCard'
import PokemonFilters from '../../components/pokemon/PokemonFilters'
import PokemonModal from '../../components/pokemon/PokemonModal'
import SEO from '../../components/SEO'
import { ArrowLeft } from 'lucide-react'
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
      titulo="Pokemon TCG"
      subtitulo="Busca cartas de todas las ediciones y consulta informacion detallada"
      icono="🎴"
    >
      <SEO 
      title="Pokemon TCG - Buscador de Cartas"
      description="Busca cartas Pokemon TCG con precios de mercado en USD, EUR y CLP."
      url="/demos/pokemon"
    />
      <Link 
        to="/herramientas" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-6 font-bold transition-all"
      >
        <ArrowLeft size={20} /> Volver a Herramientas
      </Link>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre (ej: Charizard, Pikachu...)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        <PokemonFilters
          filters={filters}
          setFilters={setFilters}
          sets={sets}
          types={types}
          rarities={rarities}
          onApply={() => searchCards()}
        />
      </div>

      {cards.length > 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {cards.length} cartas encontradas
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <PokemonCard
                card={card}
                onClick={() => loadCardDetail(card.id)}
              />
            </motion.div>
          ))}
        </div>
      ) : search || filters.set || filters.types || filters.rarity ? (
        <div className="text-center py-20 text-gray-500">
          No se encontraron cartas con esos criterios
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-6xl mb-4">🔍</p>
          <p>Ingresa un nombre o aplica filtros para buscar cartas</p>
        </div>
      )}

      <PokemonModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </PageLayout>
  )
}

export default Pokemon