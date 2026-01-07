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
  
  // Tasa de cambio aproximada USD a CLP
  const USD_TO_CLP = 980
  const EUR_TO_CLP = 1050

  const formatUSD = (price) => {
    if (!price) return '-'
    return '$' + Number(price).toFixed(2)
  }

  const formatEUR = (price) => {
    if (!price) return '-'
    return '€' + Number(price).toFixed(2)
  }

  const formatCLP = (price, rate) => {
    if (!price) return '-'
    const clp = Math.round(Number(price) * rate)
    return '$' + clp.toLocaleString('es-CL')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          X
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="flex justify-center">
            {card.images?.large ? (
              <img
                src={card.images.large}
                alt={card.name}
                className="max-w-full h-auto rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                Sin imagen
              </div>
            )}
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
              {card.set?.logo && (
                <img src={card.set.logo} alt="" className="h-8" />
              )}
              <div>
                <p className="font-medium">{card.set?.name}</p>
                <p className="text-sm text-gray-500">#{card.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Rareza</p>
                <p className="font-medium">{card.rarity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ilustrador</p>
                <p className="font-medium">{card.artist || 'N/A'}</p>
              </div>
            </div>

            {card.abilities && card.abilities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Habilidades</h3>
                <div className="space-y-2">
                  {card.abilities.map((ability, i) => (
                    <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded">{ability.type}</span>
                        <span className="font-medium">{ability.name}</span>
                      </div>
                      {ability.effect && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ability.effect}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.attacks && card.attacks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Ataques</h3>
                <div className="space-y-2">
                  {card.attacks.map((attack, i) => (
                    <div key={i} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{attack.name}</span>
                        {attack.damage && (
                          <span className="text-red-600 font-bold">{attack.damage}</span>
                        )}
                      </div>
                      {attack.effect && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{attack.effect}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {card.weaknesses && card.weaknesses.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Debilidad</p>
                  {card.weaknesses.map((w, i) => (
                    <span key={i} className="text-red-600">{w.type} {w.value}</span>
                  ))}
                </div>
              )}
              {card.resistances && card.resistances.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Resistencia</p>
                  {card.resistances.map((r, i) => (
                    <span key={i} className="text-green-600">{r.type} {r.value}</span>
                  ))}
                </div>
              )}
            </div>

            {/* PRECIOS DE MERCADO */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold mb-3 text-lg">Precios de Mercado</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* TCGPlayer USD */}
                {(tcgPrices.low || tcgPrices.market) && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-blue-700 dark:text-blue-300">TCGPlayer (USD)</p>
                      {tcgPrices.updated && (
                        <span className="text-xs text-gray-500">Act: {new Date(tcgPrices.updated).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Mercado</p>
                        <p className="font-bold text-green-600 text-lg">{formatUSD(tcgPrices.market)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(tcgPrices.market, USD_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Bajo</p>
                        <p className="font-semibold">{formatUSD(tcgPrices.low)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(tcgPrices.low, USD_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Medio</p>
                        <p className="font-semibold">{formatUSD(tcgPrices.mid)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(tcgPrices.mid, USD_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Alto</p>
                        <p className="font-semibold">{formatUSD(tcgPrices.high)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(tcgPrices.high, USD_TO_CLP)} CLP</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cardmarket EUR */}
                {(cardmarketPrices.low || cardmarketPrices.trend) && (
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-orange-700 dark:text-orange-300">Cardmarket (EUR)</p>
                      {cardmarketPrices.updated && (
                        <span className="text-xs text-gray-500">Act: {new Date(cardmarketPrices.updated).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Tendencia</p>
                        <p className="font-bold text-green-600 text-lg">{formatEUR(cardmarketPrices.trend)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(cardmarketPrices.trend, EUR_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Bajo</p>
                        <p className="font-semibold">{formatEUR(cardmarketPrices.low)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(cardmarketPrices.low, EUR_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Promedio 7d</p>
                        <p className="font-semibold">{formatEUR(cardmarketPrices.avg7)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(cardmarketPrices.avg7, EUR_TO_CLP)} CLP</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Promedio 30d</p>
                        <p className="font-semibold">{formatEUR(cardmarketPrices.avg30)}</p>
                        <p className="text-xs text-gray-500">{formatCLP(cardmarketPrices.avg30, EUR_TO_CLP)} CLP</p>
                      </div>
                    </div>
                  </div>
                )}

                {!tcgPrices.market && !cardmarketPrices.trend && (
                  <p className="text-gray-500 text-center py-4">No hay precios disponibles para esta carta</p>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                * Precios en CLP son referenciales (USD: $980, EUR: $1.050)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal