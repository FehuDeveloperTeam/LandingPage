import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { Menu, X, Wrench, LayoutGrid, FileText, Home, BookOpen } from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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
    <nav className="sticky top-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <div className="ml-4 pl-4 border-l border-gray-100 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            className="p-2 text-gray-900 dark:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - REESTRUCTURADO */}
      {menuOpen && (
        <div className="fixed inset-0 top-20 z-50 md:hidden bg-white dark:bg-gray-900 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-10">
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.path
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all active:scale-95 ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' 
                        : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-white dark:bg-white/10 shadow-sm'}`}>
                        <Icon size={22} className={isActive ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <span className="font-black uppercase tracking-[0.2em] text-sm">{link.name}</span>
                    </div>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </Link>
                )
              })}
            </div>

            {/* Footer del Menú Móvil */}
            <div className="mt-16 text-center">
              <div className="h-px w-16 bg-gray-200 dark:bg-white/10 mx-auto mb-8" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] leading-loose">
                Andrés Zurita<br/>
                Engineering Suite © 2026<br/>
                Ñuble, Chile
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar