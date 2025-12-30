import { useState } from 'react'

function ProjectCard({ proyecto }) {
  const [flipped, setFlipped] = useState(false)

  const imagenes = {
    'SimpleCuenta': '/images/proyectos/SimpleCuenta.png',
    'ConexionDiaria': '/images/proyectos/ConexionDiaria.png',
    'HHM Neonatología': '/images/proyectos/Hospital.png',
  }

  const imagen = imagenes[proyecto.nombre]

  return (
    <div 
      className="h-72 perspective-1000 cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}
      >
        {/* Frente */}
        <div className="absolute w-full h-full backface-hidden border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          {/* Imagen */}
          <div className="h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            {imagen ? (
              <img 
                src={imagen} 
                alt={proyecto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                📱
              </div>
            )}
          </div>
          
          {/* Info - altura fija con contenido centrado */}
          <div className="h-36 flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-bold text-center mb-3">{proyecto.nombre}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {proyecto.tecnologias.slice(0, 4).map((t, j) => (
                <span 
                  key={j} 
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                  {t}
                </span>
              ))}
              {proyecto.tecnologias.length > 4 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  +{proyecto.tecnologias.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Atrás */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed text-sm">
            {proyecto.descripcion || 'Proyecto en desarrollo. Más información próximamente.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard