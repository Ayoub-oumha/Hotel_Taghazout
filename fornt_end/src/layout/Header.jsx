import React, { useState, useContext } from 'react';
import logo from "../../public/images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaUserShield, FaShoppingCart } from 'react-icons/fa';
import { useReservationCart } from '../context/ReservationCartContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useReservationCart();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }; 

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className='relative font-[Poppins]'>
      <div className='flex items-center justify-between p-2 px-4 md:px-16'>
        <Link to='/'><img className='w-20 md:w-24' src={logo} alt="logo" /></Link>
        
        {/* Desktop Navigation */}
        <ul className='hidden md:flex align-center gap-6 lg:gap-10'>
        {(!user || user.role != 'admin') && (
            <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Explore">Explore</Link></li>
            <li><Link to="/Rooms">Rooms</Link></li>
            <li><Link to="/About">About</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            </>
          )}
          
          
          {user && user.role === 'admin' && (
            <li><Link to="/dashboard" className="text-[#7C6A46] font-bold">Dashboard</Link></li>
          )}
          {user && user.role === 'admin' && (
            <li><Link to="/users" className="text-[#7C6A46] font-bold">users</Link></li>
          )}
          {user && user.role === 'admin' && (
            <li><Link to="/admin/rooms" className="text-[#7C6A46] font-bold">Gestion des chembre</Link></li>
          )}
        </ul>
        
        <div className='hidden md:flex gap-2 items-center'>
          {!user ? (
            <>
              <Link to="/login" className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Login</Link>
              <Link to="/register" className='border border-[#7C6A46] text-[#7C6A46] px-3 py-2 rounded cursor-pointer hover:bg-[#7C6A46] hover:text-white transition-colors'>Register</Link>
            </>
          ) : (
            <>
             

              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 bg-[#F5F2EA] px-3 py-2 rounded-full hover:bg-[#EAE6DF] transition-colors"
                >
                  {user.role === 'admin' && (
                    <FaUserShield className="text-[#7C6A46]" />
                  )}
                  {user.role !== 'admin' && (
                    <FaUserCircle className="text-[#7C6A46]" />
                  )}
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {user.role === 'admin' && (
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Dashboard
                        </Link>
                      )}
                      
                      
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" /> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* <button className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Book now</button> */}
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
            {user && user.role === 'admin' && (
              <li className='px-4 py-2'><Link to="/dashboard" onClick={toggleMenu} className="text-[#7C6A46] font-bold">Dashboard</Link></li>
            )}
          </ul>
          
          <div className='flex flex-col gap-2 px-4 pb-4'>
            {!user ? (
              <>
                <Link to="/login" onClick={toggleMenu} className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer text-center'>Login</Link>
                <Link to="/register" onClick={toggleMenu} className='border border-[#7C6A46] text-[#7C6A46] px-3 py-2 rounded cursor-pointer text-center'>Register</Link>
              </>
            ) : (
              <>
                {/* Mobile Cart Link */}
              
                
                <div className="bg-[#F5F2EA] p-3 rounded-md mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    {user.role === 'admin' ? <FaUserShield className="text-[#7C6A46]" /> : <FaUserCircle className="text-[#7C6A46]" />}
                    <div>
                      <p className="font-bold text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                   
                    <Link to="/my-reservations" onClick={toggleMenu} className="text-sm text-gray-700 hover:text-[#7C6A46] py-1">
                      Mes réservations
                    </Link>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded border border-red-200"
                >
                  <FaSignOutAlt /> Se déconnecter
                </button>
              </>
            )}
            
            <button className='bg-[#7C6A46] text-white px-3 py-2 rounded cursor-pointer'>Book now</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;