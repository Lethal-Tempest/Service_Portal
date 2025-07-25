import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='flex bg-blue-300 justify-between items-center px-20 py-5 mb-10'>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <div>About</div>
            <div>Contact</div>
        </div>
    )
}

export default Navbar