import { useState } from 'react'
import { useCart } from '../context/CartContext'

function ProductCard({ producto }) {
  const [imagenActual, setImagenActual] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const { addToCart, removeFromCart, isInCart, getCartItem } = useCart()

  const imagenes = [producto.imagen0, producto.imagen1].filter(img => img)
  const enCarrito = isInCart(producto.id)
  const itemCarrito = getCartItem(producto.id)

  const cambiarImagen = (direccion) => {
    if (imagenes.length <= 1) return
    setImagenActual(prev => {
      if (direccion === 'next') return (prev + 1) % imagenes.length
      return prev === 0 ? imagenes.length - 1 : prev - 1
    })
  }

  const handleCantidad = (valor) => {
    const nueva = cantidad + valor
    if (nueva >= 1 && nueva <= producto.cantidad) {
      setCantidad(nueva)
    }
  }

  const handleInputCantidad = (e) => {
    const valor = parseInt(e.target.value) || 1
    if (valor >= 1 && valor <= producto.cantidad) {
      setCantidad(valor)
    }
  }

  const handleCarrito = () => {
    if (enCarrito) {
      removeFromCart(producto.id, cantidad)
    } else {
      addToCart(producto, cantidad)
    }
  }

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {imagenes.length > 0 ? (
          <img 
            src={imagenes[imagenActual]} 
            alt={producto.nombre_completo}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-4xl">📷</span>
        )}
        
        {imagenes.length > 1 && (
          <>
            <button 
              onClick={() => cambiarImagen('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              ‹
            </button>
            <button 
              onClick={() => cambiarImagen('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-sm leading-tight">{producto.nombre_completo}</h3>
        
        <p className="text-xl font-bold">{formatoPrecio(producto.precio_venta)}</p>
        
        <p className={`text-sm ${
          producto.estado_stock === 'Stock disponible' 
            ? 'text-green-600 dark:text-green-400' 
            : producto.estado_stock === 'Sin stock'
            ? 'text-red-600 dark:text-red-400'
            : 'text-yellow-600 dark:text-yellow-400'
        }`}>
          {producto.estado_stock}
        </p>

        {producto.cantidad > 0 && (
          <>
            {/* Selector cantidad */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleCantidad(-1)}
                className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                -
              </button>
              <input
                type="number"
                value={cantidad}
                onChange={handleInputCantidad}
                className="w-16 h-8 text-center border border-gray-300 dark:border-gray-600 rounded bg-transparent"
                min="1"
                max={producto.cantidad}
              />
              <button 
                onClick={() => handleCantidad(1)}
                className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>

            {/* Botón carrito */}
            <button
              onClick={handleCarrito}
              className={`w-full py-2 rounded transition ${
                enCarrito
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
              }`}
            >
              {enCarrito ? `Quitar del carrito (${itemCarrito.cantidad})` : 'Agregar al carrito'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductCard