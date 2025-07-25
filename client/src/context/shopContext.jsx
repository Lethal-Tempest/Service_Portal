// ShopContext.jsx
import { createContext, useContext } from 'react'

export const ShopContext = createContext()

export const useShopContext = () => useContext(ShopContext)

export const ShopProvider = ({ children }) => {
  const products = [
    {
      id: 1,
      name: 'Laptop',
      description: 'A high-performance laptop',
      price: 899,
      quantity: 10
    },
    {
      id: 2,
      name: 'Phone',
      description: 'Latest smartphone',
      price: 499,
      quantity: 25
    }
  ]

  return (
    <ShopContext.Provider value={{ products }}>
      {children}
    </ShopContext.Provider>
  )
}

