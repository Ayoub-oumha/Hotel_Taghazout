import React from 'react' ;
import logo from "../../public/images/logo.png" ;
import { Link } from 'react-router-dom'
function Header() {
  return (
    <header className='flex items-center justify-between p-2 px-16'>
            <Link to='/' ><img className='w-24' src={logo} alt="logo" /></Link>
            <ul className='flex align-centre gap-10'>
                <li><Link to="/" >Home</Link></li>
                <li><Link to="/Explore">Explore</Link></li>
                <li><Link to="/Rooms" >Rooms</Link></li>
                <li><Link to="/About" >About</Link></li>
                <li><Link to="/Contact" >Contact</Link></li>
            </ul>
            <button className='bg-[#7C6A46] text-white p-2 rounded cursor-pointer' >Book now</button>
    </header>
  )
}

export default Header