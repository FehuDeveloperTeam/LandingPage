function PokemonCard({ card, onClick }) {
  const price = card.prices?.tcgplayer?.market || card.prices?.cardmarket?.trendPrice

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {/* Imagen */}
        <div className="aspect-[2.5/3.5] overflow-hidden">
          <img
            src={card.images?.small}
            alt={card.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{card.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {card.set?.name}
          </p>
          
          {/* Precio */}
          {price && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Precio</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                ${price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Badge de rareza */}
        {card.rarity && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            {card.rarity}
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonCard