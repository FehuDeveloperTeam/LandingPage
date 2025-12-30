import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (producto, cantidad) => {
    setCart(prev => {
      const existe = prev.find(item => item.id === producto.id)
      if (existe) {
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const removeFromCart = (productoId, cantidad) => {
    setCart(prev => {
      const item = prev.find(item => item.id === productoId)
      if (!item) return prev
      
      if (item.cantidad <= cantidad) {
        return prev.filter(item => item.id !== productoId)
      }
      return prev.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - cantidad }
          : item
      )
    })
  }

  const isInCart = (productoId) => {
    return cart.some(item => item.id === productoId)
  }

  const getCartItem = (productoId) => {
    return cart.find(item => item.id === productoId)
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      isInCart,
      getCartItem,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}