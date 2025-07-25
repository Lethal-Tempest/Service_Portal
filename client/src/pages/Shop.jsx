import React from 'react'
import { useShopContext } from '../context/shopContext'

const Shop = () => {
  const { products } = useShopContext()

  return (
    <div>
      {products.map(item => (
        <div key={item.id} className="p-4 border rounded mb-4">
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  )
}


export default Shop