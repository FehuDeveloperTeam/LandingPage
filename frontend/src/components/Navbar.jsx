import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 py-4 px-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-semibold">Andrés Zurita</Link>
        
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/curriculum" className="hover:underline">Currículum</Link>
          <Link to="/demos" className="hover:underline">Demos</Link>
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 items-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:underline">Inicio</Link>
          <Link to="/curriculum" onClick={() => setMenuOpen(false)} className="hover:underline">Currículum</Link>
          <Link to="/demos" onClick={() => setMenuOpen(false)} className="hover:underline">Demos</Link>
          <ThemeToggle />
        </div>
      )}
    </nav>
  )
}

export default Navbar