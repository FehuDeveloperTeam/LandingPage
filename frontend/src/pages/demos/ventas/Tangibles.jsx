import { useState, useEffect } from 'react'
import { getProductos } from '../../../services/api'
import { useCart } from '../../../context/CartContext'
import DemoLayout from '../../../components/DemoLayout'
import Cart from '../../../components/Cart'

function ProductCard({ producto, tema }) {
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
    <div className={`${tema.card} rounded-2xl overflow-hidden ${tema.cardHover} transition-all duration-500 group`}>
      {/* Imagen */}
      <div className="relative h-52 bg-gradient-to-br from-orange-100/50 to-amber-100/50 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center overflow-hidden">
        {imagenes.length > 0 ? (
          <img 
            src={imagenes[imagenActual]} 
            alt={producto.nombre_completo}
            className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-7xl opacity-50 group-hover:scale-110 transition-transform duration-500">🚗</span>
        )}
        
        {imagenes.length > 1 && (
          <>
            <button 
              onClick={() => cambiarImagen('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              ‹
            </button>
            <button 
              onClick={() => cambiarImagen('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              ›
            </button>
          </>
        )}

        {/* Badge de stock */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur ${
          producto.estado_stock === 'Stock disponible' 
            ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
            : producto.estado_stock === 'Sin stock'
            ? 'bg-red-500/20 text-red-700 dark:text-red-300'
            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
        }`}>
          {producto.estado_stock}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-4">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {producto.nombre_completo}
        </h3>
        
        <p className={`text-3xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
          {formatoPrecio(producto.precio_venta)}
        </p>

        {producto.cantidad > 0 && (
          <>
            {/* Selector cantidad */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleCantidad(-1)}
                className={`w-10 h-10 ${tema.card} rounded-xl flex items-center justify-center hover:scale-110 transition-transform text-lg font-bold`}
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-lg">{cantidad}</span>
              <button 
                onClick={() => handleCantidad(1)}
                className={`w-10 h-10 ${tema.card} rounded-xl flex items-center justify-center hover:scale-110 transition-transform text-lg font-bold`}
              >
                +
              </button>
            </div>

            {/* Botón carrito */}
            <button
              onClick={handleCarrito}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                enCarrito
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                  : tema.btnPrimary
              }`}
            >
              {enCarrito ? `✓ En carrito (${itemCarrito.cantidad})` : '🛒 Agregar al carrito'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Tangibles() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async (termino = '') => {
    setLoading(true)
    try {
      const data = await getProductos(termino)
      setProductos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProductos(search)
  }

  return (
    <DemoLayout tema="tangibles">
      {(tema) => (
        <div className="space-y-10">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-4xl shadow-lg shadow-orange-500/30 mb-2">
              🚗
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${tema.gradient} bg-clip-text text-transparent`}>
              AutoParts Ñuble
            </h1>
            <p className={`${tema.textMuted} text-lg max-w-xl mx-auto`}>
              Los mejores repuestos y accesorios para tu vehículo con envío a toda la región
            </p>
          </header>

          {/* Barra de búsqueda */}
          <div className={`${tema.card} rounded-2xl p-4 md:p-6`}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por marca, modelo, año... (ej: Toyota Yaris 2015)"
                  className={`w-full pl-12 pr-4 py-4 ${tema.input} rounded-xl outline-none transition-all`}
                />
              </div>
              <button
                type="submit"
                className={`px-8 py-4 ${tema.btnPrimary} rounded-xl font-semibold transition-all duration-300 hover:scale-105`}
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={`relative px-6 py-4 ${tema.btnSecondary} rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2`}
              >
                🛒 
                <span className="hidden md:inline">Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Productos */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className={`w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin`}></div>
              <p className={tema.textMuted}>Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className={`${tema.card} rounded-2xl p-12 text-center`}>
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className={tema.textMuted}>Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <>
              <p className={`${tema.textMuted} text-sm`}>
                Mostrando {productos.length} productos
              </p>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productos.map(producto => (
                  <ProductCard key={producto.id} producto={producto} tema={tema} />
                ))}
              </div>
            </>
          )}

          <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      )}
    </DemoLayout>
  )
}

export default Tangibles