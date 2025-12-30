import { useCart } from '../context/CartContext'

function Cart({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  const precioNeto = Math.round(cartTotal / 1.19)
  const iva = cartTotal - precioNeto

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Carrito de compras</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Tu carrito está vacío
            </p>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center shrink-0">
                      {item.imagen0 ? (
                        <img src={item.imagen0} alt={item.nombre_completo} className="w-full h-full object-contain" />
                      ) : (
                        <span>📷</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-tight mb-1">{item.nombre_completo}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                      <p className="text-sm">Unitario: {formatoPrecio(item.precio_venta)}</p>
                      <p className="font-semibold">{formatoPrecio(item.precio_venta * item.cantidad)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.cantidad)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Neto:</span>
                  <span>{formatoPrecio(precioNeto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IVA (19%):</span>
                  <span>{formatoPrecio(iva)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>{formatoPrecio(cartTotal)}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => alert('Conectar con pasarela de pago')}
                  className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:opacity-90 transition font-medium"
                >
                  Continuar con el pago
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart