import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  logo?: string;
}

const ClienteNavbar: React.FC<NavbarProps> = ({ logo = './assets/explo.png' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-green-400 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Reactors Logo" className="h-10 w-10" />
          <span className="text-xl font-bold">Reactors</span>
        </Link>
        
        {/* Navigation links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/galeria" className="hover:text-gray-200 transition-colors">Galería</Link>
          <Link to="/shop" className="hover:text-gray-200 transition-colors">Shop</Link>
          <Link to="/contacto" className="hover:text-gray-200 transition-colors">Contacto</Link>
          <Link to="/login" className="hover:text-gray-200 transition-colors">Log In</Link>
        </div>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="bg-transparent text-gray-800 focus:outline-none w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="ml-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClienteNavbar;