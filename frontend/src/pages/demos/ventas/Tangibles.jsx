import { useState, useEffect } from 'react'
import { getProductos } from '../../../services/api'
import { useCart } from '../../../context/CartContext'
import DemoLayout from '../../../components/DemoLayout'
import Cart from '../../../components/Cart'
import { 
  Search, ShoppingCart, ChevronLeft, ChevronRight, 
  Plus, Minus, Check, Package, AlertCircle, 
  Filter, ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'

function ProductCard({ producto, tema }) {
  const [imagenActual, setImagenActual] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const { addToCart, removeFromCart, isInCart, getCartItem } = useCart()

  const imagenes = [producto.imagen0, producto.imagen1].filter(img => img)
  const enCarrito = isInCart(producto.id)
  const itemCarrito = getCartItem(producto.id)

  const cambiarImagen = (e, direccion) => {
    e.stopPropagation()
    if (imagenes.length <= 1) return
    setImagenActual(prev => {
      if (direccion === 'next') return (prev + 1) % imagenes.length
      return prev === 0 ? imagenes.length - 1 : prev - 1
    })
  }

  const handleCantidad = (valor) => {
    const nueva = cantidad + valor
    if (nueva >= 1 && nueva <= (producto.cantidad || 99)) {
      setCantidad(nueva)
    }
  }

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)
  }

  return (
    <div className={`group relative bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col`}>
      {/* Visual Area */}
      <div className="relative aspect-square bg-gray-50 dark:bg-black/20 flex items-center justify-center overflow-hidden">
        {imagenes.length > 0 ? (
          <img 
            src={imagenes[imagenActual]} 
            alt={producto.nombre_completo}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <Package size={64} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin Imagen</span>
          </div>
        )}
        
        {/* Controles Imagen */}
        {imagenes.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => cambiarImagen(e, 'prev')} className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={(e) => cambiarImagen(e, 'next')} className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
            producto.estado_stock === 'Stock disponible' 
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-600 border-red-500/20'
          }`}>
            {producto.estado_stock}
          </div>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">SKU: {producto.id.toString().padStart(5, '0')}</p>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 uppercase tracking-tight italic">
            {producto.nombre_completo}
          </h3>
        </div>
        
        <div className="flex items-end justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio Neto</span>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
              {formatoPrecio(producto.precio_venta)}
            </span>
          </div>
          
          {/* Selector de Cantidad Estilizado */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
            <button onClick={() => handleCantidad(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-xs font-black">{cantidad}</span>
            <button onClick={() => handleCantidad(1)} className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          onClick={() => enCarrito ? removeFromCart(producto.id) : addToCart(producto, cantidad)}
          className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
            enCarrito
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02]'
          }`}
        >
          {enCarrito ? (
            <><AlertCircle size={16} /> Quitar del Pedido</>
          ) : (
            <><ShoppingCart size={16} /> Añadir al Carrito</>
          )}
        </button>
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

  useEffect(() => { fetchProductos() }, [])

  const fetchProductos = async (termino = '') => {
    setLoading(true)
    try {
      const data = await getProductos(termino)
      setProductos(data)
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  return (
    <DemoLayout tema="tangibles">
      {(tema) => (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          
          {/* Top Navigation Refined */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/demos/ventas" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Soluciones
            </Link>
            
            <div className="flex items-center gap-4">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sistema Conectado / Stock Real</span>
            </div>
          </div>

          {/* Header Editorial */}
          <header className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
                AutoParts<br/><span className="text-blue-600">Ñuble</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md">
                Distribuidora técnica de componentes automotrices de alta precisión para toda la región.
              </p>
            </div>
            
            {/* Buscador Estilo Consola */}
            <form onSubmit={(e) => { e.preventDefault(); fetchProductos(search); }} className="w-full md:w-auto flex flex-grow max-w-md gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar pieza..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                />
              </div>
              <button onClick={() => setCartOpen(true)} className="relative p-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                    {cartCount}
                  </span>
                )}
              </button>
            </form>
          </header>

          {/* Grid de Productos */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-[400px] rounded-[2rem] bg-gray-50 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="py-40 text-center">
              <div className="inline-flex p-8 rounded-full bg-gray-50 dark:bg-white/5 mb-6">
                <Filter size={48} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black uppercase italic italic tracking-tighter">Sin coincidencias técnicas</h3>
              <p className="text-gray-400 mt-2">Prueba con marca, modelo o código de pieza.</p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} tema={tema} />
              ))}
            </div>
          )}

          <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      )}
    </DemoLayout>
  )
}

export default Tangibles