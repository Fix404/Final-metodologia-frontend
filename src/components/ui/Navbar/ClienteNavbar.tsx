import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

interface NavbarProps {
  logo?: string;
}

const ClienteNavbar: React.FC<NavbarProps> = ({ logo = './assets/explo.png' }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const cantidadEnCarrito = useSelector((state: RootState) => state.carrito.items.length);

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
          <Link to="/detalle" className="hover:text-gray-200 transition-colors">Galería</Link>
          <Link to="/shop" className="hover:text-gray-200 transition-colors">Shop</Link>
          <Link to="/admin" className="hover:text-gray-200 transition-colors">Contacto</Link>
          <Link to="/login" className="hover:text-gray-200 transition-colors">Log In</Link>
        </div>

        <div className="flex items-center space-x-4">
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

          {/* Carrito */}
          <Link to="/carrito" className="relative hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11L17 13M9 21h0M15 21h0" />
            </svg>

            {cantidadEnCarrito > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cantidadEnCarrito}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ClienteNavbar;
