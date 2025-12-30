import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import Demos from './pages/Demos'
import Ventas from './pages/demos/Ventas'
import Tangibles from './pages/demos/ventas/Tangibles'
import Servicios from './pages/demos/Servicios'
import Presentacion from './pages/demos/Presentacion'
import Intangibles from './pages/demos/ventas/Intangibles'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/demos/ventas/intangibles" element={<PageTransition><Intangibles /></PageTransition>} />
        <Route path="/curriculum" element={<PageTransition><Curriculum /></PageTransition>} />
        <Route path="/demos" element={<PageTransition><Demos /></PageTransition>} />
        <Route path="/demos/ventas" element={<PageTransition><Ventas /></PageTransition>} />
        <Route path="/demos/ventas/tangibles" element={<PageTransition><Tangibles /></PageTransition>} />
        <Route path="/demos/servicios" element={<PageTransition><Servicios /></PageTransition>} />
        <Route path="/demos/presentacion" element={<PageTransition><Presentacion /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Navbar />
          <main className="flex-grow overflow-y-auto">
            <div className="max-w-6xl mx-auto px-8 py-12">
              <AnimatedRoutes />
            </div>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App