import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { Menu, X, Wrench, LayoutGrid, FileText, Home, BookOpen } from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Bloquear el scroll del cuerpo cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Currículum', path: '/curriculum', icon: FileText },
    { name: 'Demos', path: '/demos', icon: LayoutGrid },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Herramientas', path: '/herramientas', icon: Wrench, highlight: true },
  ]

  return (
    <nav className="sticky top-0 z-[100] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Branding */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-gray-900 transition-transform group-hover:rotate-12">
            <span className="font-black text-xl italic leading-none">A</span>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] hidden sm:block">
            Andrés Zurita
          </span>
        </Link>
        
        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            className="p-2 text-gray-900 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav (Omitido por brevedad, igual al anterior) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all">
              {link.name}
            </Link>
          ))}
          <div className="ml-4 pl-4 border-l border-gray-100 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - REPARADO */}
      {menuOpen && (
        <div className="fixed inset-0 top-20 z-50 md:hidden bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="flex flex-col h-full px-6 py-10 pb-32">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                        : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-white dark:bg-white/10'}`}>
                        <Icon size={24} className={isActive ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <span className="font-black uppercase tracking-[0.2em] text-sm">{link.name}</span>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </Link>
                )
              })}
            </div>
            
            <div className="mt-auto pt-12 text-center">
              <div className="h-px w-12 bg-gray-200 dark:bg-white/10 mx-auto mb-6" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                © 2026 Andrés Zurita • San Carlos, Ñuble, CL
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar