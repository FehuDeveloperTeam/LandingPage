import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageLayout from '../../components/PageLayout'
import PokemonCard from '../../components/pokemon/PokemonCard'
import PokemonFilters from '../../components/pokemon/PokemonFilters'
import PokemonModal from '../../components/pokemon/PokemonModal'

const POKEMON_API = 'https://api.pokemontcg.io/v2'

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
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalCount: 0
  })

  const [sets, setSets] = useState([])
  const [types, setTypes] = useState([])
  const [rarities, setRarities] = useState([])

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [setsRes, typesRes, raritiesRes] = await Promise.all([
          fetch(`${POKEMON_API}/sets?orderBy=-releaseDate`),
          fetch(`${POKEMON_API}/types`),
          fetch(`${POKEMON_API}/rarities`)
        ])
        
        const setsData = await setsRes.json()
        const typesData = await typesRes.json()
        const raritiesData = await raritiesRes.json()
        
        setSets(setsData.data || [])
        setTypes(typesData.data || [])
        setRarities(raritiesData.data || [])
      } catch (error) {
        console.error('Error cargando filtros:', error)
      }
    }
    loadFilters()
  }, [])

  const searchCards = async (page = 1) => {
    setLoading(true)
    try {
      const queryParts = []
      if (search) queryParts.push(`name:"${search}*"`)
      if (filters.set) queryParts.push(`set.id:${filters.set}`)
      if (filters.types) queryParts.push(`types:${filters.types}`)
      if (filters.rarity) queryParts.push(`rarity:"${filters.rarity}"`)
      
      const query = queryParts.length > 0 ? queryParts.join(' ') : '*'
      
      const params = new URLSearchParams({
        q: query,
        page: page,
        pageSize: 20,
        orderBy: '-set.releaseDate'
      })

      const response = await fetch(`${POKEMON_API}/cards?${params}`)
      const data = await response.json()
      
      setCards(data.data || [])
      setPagination({
        page: data.page || 1,
        pageSize: data.pageSize || 20,
        totalCount: data.totalCount || 0
      })
    } catch (error) {
      console.error('Error buscando cartas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    searchCards(1)
  }

  const loadCardDetail = async (cardId) => {
    try {
      const response = await fetch(`${POKEMON_API}/cards/${cardId}`)
      const data = await response.json()
      setSelectedCard(parseCard(data.data))
    } catch (error) {
      console.error('Error cargando carta:', error)
    }
  }

  const parseCard = (card) => {
    if (!card) return null
    
    const tcgplayer = card.tcgplayer || {}
    const prices = tcgplayer.prices || {}
    const priceData = prices.holofoil || prices.reverseHolofoil || prices.normal || {}
    const cardmarket = card.cardmarket || {}
    const cardmarketPrices = cardmarket.prices || {}

    return {
      id: card.id,
      name: card.name,
      types: card.types || [],
      hp: card.hp,
      set: {
        id: card.set?.id,
        name: card.set?.name,
        series: card.set?.series,
        symbol: card.set?.images?.symbol
      },
      rarity: card.rarity,
      number: card.number,
      artist: card.artist,
      images: card.images || {},
      attacks: card.attacks || [],
      weaknesses: card.weaknesses || [],
      resistances: card.resistances || [],
      prices: {
        tcgplayer: {
          low: priceData.low,
          mid: priceData.mid,
          high: priceData.high,
          market: priceData.market,
          url: tcgplayer.url
        },
        cardmarket: {
          averageSellPrice: cardmarketPrices.averageSellPrice,
          trendPrice: cardmarketPrices.trendPrice,
          url: cardmarket.url
        }
      }
    }
  }

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize)

  return (
    <PageLayout
      titulo="Pokemon TCG"
      subtitulo="Busca cartas de todas las ediciones y consulta precios del mercado"
      icono="🎴"
    >
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
          sets={sets.map(s => ({ id: s.id, name: s.name, series: s.series }))}
          types={types}
          rarities={rarities}
          onApply={() => searchCards(1)}
        />
      </div>

      {pagination.totalCount > 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {pagination.totalCount} cartas encontradas
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : cards.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PokemonCard
                  card={parseCard(card)}
                  onClick={() => loadCardDetail(card.id)}
                />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => searchCards(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Pagina {pagination.page} de {totalPages}
              </span>
              <button
                onClick={() => searchCards(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
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