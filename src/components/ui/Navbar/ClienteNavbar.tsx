import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import logoEmpresa from '../../../images/logo.png';

import {
  setTexto,
  setResultados,
  limpiarBusqueda,
} from '../../../redux/slices/busquedaSlice';


const ClienteNavbar = () => {
  const dispatch = useDispatch();

  const productos = useSelector((state: RootState) => state.producto.productos);
  const cantidadEnCarrito = useSelector((state: RootState) => state.carrito.items.length);

  const query = useSelector((state: RootState) => state.busqueda.texto);
  const resultados = useSelector((state: RootState) => state.busqueda.resultados);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    dispatch(setTexto(texto));

    if (texto.trim() === '') {
      dispatch(setResultados([]));
      return;
    }

    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    dispatch(setResultados(filtrados));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        dispatch(limpiarBusqueda());
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  console.log('Resultados actuales:', resultados);


  return (
    <nav className="bg-gradient-to-r from-blue-500 to-[#DDA853] text-white p-2 pl-0 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center ">
          <img src={logoEmpresa} alt="Reactors Logo" className="h-8 w-10" />
          <span className='text-ml font-["Alumni_Sans_SC"]'>ReactorS</span>
        </Link>


        {/* Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/productos" className="hover:text-gray-200 transition-colors">Galería</Link>
          <Link to="/shop" className="hover:text-gray-200 transition-colors">Shop</Link>
          <Link to="/admin" className="hover:text-gray-200 transition-colors">Contacto</Link>
          <Link to="/login" className="hover:text-gray-200 transition-colors">Log In</Link>
        </div>

        {/* Barra de búsqueda + carrito */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Barra de búsqueda */}
          <div className="relative" ref={containerRef}>
            <div className="flex items-center bg-white rounded-full px-3 py-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={handleChange}
                className="bg-transparent text-gray-800 focus:outline-none w-64"
              />
              <div className="ml-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {resultados.length > 0 && (
              <ul className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {resultados.map((producto) => (
                  <Link
                    to={`/productos/${producto.id}`}
                    key={producto.id}
                    className="block px-4 py-2 hover:bg-gray-100 text-black"
                    onClick={() => dispatch(limpiarBusqueda())}
                  >
                    {producto.nombre}
                  </Link>
                ))}
              </ul>
            )}
          </div>

          {/* Carrito */}
          <Link
            to="/carrito"
            className="relative hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11L17 13M9 21h0M15 21h0"
              />
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
