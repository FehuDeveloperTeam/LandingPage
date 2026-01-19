import { useState, useEffect } from 'react'
import { getProductos } from '../../../services/api'
import { useCart } from '../../../context/CartContext'
import DemoLayout from '../../../components/DemoLayout'
import Cart from '../../../components/Cart'
import ProductCard from '../../../ProductCard' // Mantenemos el componente ProductCard que ya tienes
import { 
  Search, ShoppingCart, ChevronLeft, ChevronRight, 
  Filter, ArrowLeft, LayoutGrid 
} from 'lucide-react'
import { Link } from 'react-router-dom'

function Tangibles() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const { cartCount } = useCart()

  // ESTADOS DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => { fetchProductos() }, [])

  const fetchProductos = async (termino = '') => {
    setLoading(true)
    try {
      const data = await getProductos(termino)
      setProductos(data)
      setCurrentPage(1) // Resetear a página 1 al buscar
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  // LÓGICA DE PAGINACIÓN
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(productos.length / itemsPerPage)

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <DemoLayout tema="tangibles">
      {(tema) => (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          
          {/* Top Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/demos/ventas" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Ventas
            </Link>
            
            <div className="flex items-center gap-4">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sistema Conectado / Stock Real</span>
            </div>
          </div>

          {/* Header Editorial */}
          <header className="flex flex-col lg:flex-row items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
                AutoParts<br/><span className="text-blue-600">Ñuble</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-md">
                Distribuidora técnica de componentes automotrices de alta precisión.
              </p>
            </div>
            
            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-4 items-center">
              {/* Selector de cantidad */}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/10">
                <LayoutGrid size={16} className="ml-2 text-gray-400" />
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="bg-transparent text-[11px] font-black uppercase outline-none pr-4 cursor-pointer"
                >
                  <option value={5}>Ver 5</option>
                  <option value={10}>Ver 10</option>
                  <option value={15}>Ver 15</option>
                  <option value={50}>Ver 50</option>
                  <option value={100}>Ver 100</option>
                </select>
              </div>

              {/* Buscador */}
              <form onSubmit={(e) => { e.preventDefault(); fetchProductos(search); }} className="flex flex-grow max-w-md gap-2">
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
                <button type="button" onClick={() => setCartOpen(true)} className="relative p-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl transition-transform active:scale-90">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900">
                      {cartCount}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </header>

          {/* Grid de Productos con Paginación Aplicada */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-[400px] rounded-[2rem] bg-gray-50 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="py-40 text-center">
              <Filter size={48} className="text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Sin coincidencias técnicas</h3>
            </div>
          ) : (
            <>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-cols-5">
                {currentItems.map(producto => (
                  <ProductCard key={producto.id} producto={producto} tema={tema} />
                ))}
              </div>

              {/* SECCIONES NUMERADAS (PAGINACIÓN) */}
              <div className="flex flex-col items-center gap-6 pt-12 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/5 disabled:opacity-20 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-2 overflow-x-auto max-w-[250px] sm:max-w-full px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`min-w-[48px] h-12 rounded-xl text-xs font-black transition-all ${
                          currentPage === num 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/5 disabled:opacity-20 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, productos.length)} de {productos.length} productos
                </p>
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