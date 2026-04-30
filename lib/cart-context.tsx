"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface Product {
  code: string
  name: string
  category: string
  image?: string
  images?: string[]
  priceMayor: number
  priceBulto: number
}

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (code: string) => void
  updateQuantity: (code: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.code === product.code)
      if (existing) {
        return prev.map((item) =>
          item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((code: string) => {
    setItems((prev) => prev.filter((item) => item.code !== code))
  }, [])

  const updateQuantity = useCallback((code: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.code !== code))
    } else {
      setItems((prev) =>
        prev.map((item) => (item.code === code ? { ...item, quantity } : item))
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
