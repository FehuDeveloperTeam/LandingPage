function PokemonCard({ card, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        <div className="aspect-[2.5/3.5] overflow-hidden bg-gray-100 dark:bg-gray-700">
          {card.image_small ? (
            <img
              src={card.image_small}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{card.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {card.set_name}
          </p>
        </div>

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