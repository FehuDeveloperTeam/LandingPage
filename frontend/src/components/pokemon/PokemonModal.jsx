import { useEffect } from 'react'

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

  const formatUSD = (price) => {
    if (!price) return ''
    return '$' + Number(price).toFixed(2)
  }

  const formatEUR = (price) => {
    if (!price) return ''
    return 'EUR ' + Number(price).toFixed(2)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700"
        >
          X
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex justify-center">
            <img
              src={card.images?.large || card.images?.small}
              alt={card.name}
              className="max-w-full h-auto rounded-xl shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold">{card.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {card.types?.map((type) => (
                  <span key={type} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {type}
                  </span>
                ))}
                {card.hp && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                    HP {card.hp}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {card.set?.symbol && <img src={card.set.symbol} alt="" className="w-6 h-6" />}
              <div>
                <p className="font-medium">{card.set?.name}</p>
                <p className="text-sm text-gray-500">{card.set?.series}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Rareza</p>
                <p className="font-medium">{card.rarity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Artista</p>
                <p className="font-medium">{card.artist || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold mb-3">Precios de mercado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">TCGPlayer (USD)</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Mercado</span>
                      <span className="font-bold text-green-600">{formatUSD(tcgPrices.market)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Minimo</span>
                      <span>{formatUSD(tcgPrices.low)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Maximo</span>
                      <span>{formatUSD(tcgPrices.high)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cardmarket (EUR)</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Tendencia</span>
                      <span className="font-bold text-green-600">{formatEUR(cardmarketPrices.trendPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Promedio</span>
                      <span>{formatEUR(cardmarketPrices.averageSellPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal