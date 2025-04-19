import React, { useState } from 'react';
import logo from "../../public/images/logo.png";
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='relative font-[Poppins]'>
      <div className='flex items-center justify-between p-2 px-4 md:px-16'>
        <Link to='/'><img className='w-20 md:w-24' src={logo} alt="logo" /></Link>
        
        {/* Desktop Navigation */}
        <ul className='hidden md:flex align-center gap-6 lg:gap-10'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Explore">Explore</Link></li>
          <li><Link to="/Rooms">Rooms</Link></li>
          <li><Link to="/About">About</Link></li>
          <li><Link to="/Contact">Contact</Link></li>
        </ul>
        
        <div className='hidden md:flex gap-2'>
          <Link to="/login" className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Login</Link>
          <button className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Book now</button>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu} 
          className='md:hidden text-[#7C6A46]'
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50'>
          <ul className='flex flex-col py-4'>
            <li className='px-4 py-2'><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li className='px-4 py-2'><Link to="/Explore" onClick={toggleMenu}>Explore</Link></li>
            <li className='px-4 py-2'><Link to="/Rooms" onClick={toggleMenu}>Rooms</Link></li>
            <li className='px-4 py-2'><Link to="/About" onClick={toggleMenu}>About</Link></li>
            <li className='px-4 py-2'><Link to="/Contact" onClick={toggleMenu}>Contact</Link></li>
          </ul>
          <div className='flex gap-2 px-4 pb-4'>
            <Link to="/login" onClick={toggleMenu} className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Login</Link>
            <button className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Book now</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;