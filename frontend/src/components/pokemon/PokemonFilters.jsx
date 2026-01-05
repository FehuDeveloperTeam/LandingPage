import { useState } from 'react'

function PokemonFilters({ filters, setFilters, sets, types, rarities, onApply }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ set: '', types: '', rarity: '' })
  }

  const hasFilters = filters.set || filters.types || filters.rarity

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <span className="font-medium flex items-center gap-2">
          <span>🎛️</span>
          Filtros
          {hasFilters && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-full">
              Activos
            </span>
          )}
        </span>
        <span className={`transform transition ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Filtros */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Set/Edición */}
            <div>
              <label className="block text-sm font-medium mb-1">Edición</label>
              <select
                value={filters.set}
                onChange={(e) => handleChange('set', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las ediciones</option>
                {sets.map(set => (
                  <option key={set.id} value={set.id}>
                    {set.name} ({set.series})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={filters.types}
                onChange={(e) => handleChange('types', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Rareza */}
            <div>
              <label className="block text-sm font-medium mb-1">Rareza</label>
              <select
                value={filters.rarity}
                onChange={(e) => handleChange('rarity', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las rarezas</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={() => {
                onApply()
                setIsOpen(false)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonFilters