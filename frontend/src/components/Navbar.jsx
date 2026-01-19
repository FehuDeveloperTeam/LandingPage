import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { Menu, X, Wrench, LayoutGrid, FileText, Home, BookOpen } from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Cerrar menú al cambiar de ruta
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
            const Icon = link.icon
            const isActive = location.pathname === link.path
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' 
                    : link.highlight 
                      ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
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
            className="p-2 text-gray-900 dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-20 z-50 md:hidden bg-white dark:bg-gray-900 px-6 py-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                      : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span className="font-black uppercase tracking-widest text-xs">{link.name}</span>
                  </div>
                  <X size={14} className={`opacity-20 ${isActive ? 'block' : 'hidden'}`} />
                </Link>
              )
            })}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              © 2026 Andrés Zurita • Ñuble, CL
            </p>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar