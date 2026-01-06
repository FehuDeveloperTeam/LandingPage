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
              <div>
                <p className="font-medium">{card.set?.name}</p>
                <p className="text-sm text-gray-500">{card.set?.series} - #{card.number}</p>
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {attack.effect}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.description && (
              <div>
                <h3 className="font-semibold mb-2">Descripcion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal