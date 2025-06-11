import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import logoEmpresa from '../../../images/logo.png';

import {
  setTexto,
  setResultados,
  limpiarBusqueda,
} from '../../../redux/slices/busquedaSlice';
import { useAppSelector } from '../../../hooks/redux';
import Swal from 'sweetalert2';
import { logout } from '../../../redux/slices/authSlice';


const ClienteNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const rolUsuario = useAppSelector((state) => state.auth.rol);
  const productos = useSelector((state: RootState) => state.producto.productos);
  const cantidadEnCarrito = useSelector((state: RootState) => state.carrito.items.length);
  const query = useSelector((state: RootState) => state.busqueda.texto);
  const resultados = useSelector((state: RootState) => state.busqueda.resultados);
  const containerRef = useRef<HTMLDivElement>(null);
  const usuario = useAppSelector(state => state.auth.usuario);

  const containerRefMobile = useRef<HTMLDivElement>(null);

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
        !containerRef.current.contains(event.target as Node) &&
        containerRefMobile.current &&
        !containerRefMobile.current.contains(event.target as Node)
      ) {
        dispatch(limpiarBusqueda());
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const cerrarMenuMovil = () => {
    setMenuAbierto(false);
  };



  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Estás a punto de salir de tu cuenta',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Quedarme',
      confirmButtonText: 'Salir',
      customClass: {
        confirmButton: 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600',
        cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate('/login');
      } else {
        navigate('/');
      }
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-[#DDA853] text-white p-2 pl-4 pr-4 md:pl-10 md:pr-10 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center">
          <img src={logoEmpresa} alt="Reactors Logo" className="h-8 w-10" />
          <span className='text-ml font-["Alumni_Sans_SC"]'>ReactorS</span>
        </Link>

        {/*Links y búsqueda */}
        <div className="hidden max-mm:flex items-center space-x-8">
          <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/productos" className="hover:text-gray-200 transition-colors">Galería</Link>
          {rolUsuario?.includes("ADMIN") && (
            <Link to="/admin" className="hover:text-gray-200 transition-colors">Admin</Link>
          )}
          <Link to="/login" className="hover:text-gray-200 transition-colors">Log In</Link>
        </div>

        {/*Barra de búsqueda */}
        <div className="hidden max-mm:flex items-center space-x-4">
          <div className="relative w-80" ref={containerRef}>
            <div className={`flex items-center bg-white px-3 py-2 transition-all duration-200 ${resultados.length > 0 ? 'rounded-t-md' : 'rounded-md'
              }`}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={handleChange}
                className="bg-transparent text-gray-800 focus:outline-none w-full placeholder-gray-400"
              />
              {query ? (
                <button
                  onClick={() => {
                    dispatch(setTexto(''));
                    dispatch(setResultados([]));
                  }}
                  className="ml-2 text-gray-500 hover:cursor-pointer hover:text-red-600 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="ml-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
            </div>

            {resultados.length > 0 && (
              <ul className={`absolute top-full left-0 w-full bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg z-50 overflow-hidden ${resultados.length > 6 ? 'max-h-96 overflow-y-auto' : ''
                }`}>
                {resultados.map((producto) => (
                  <Link
                    to={`/productos/${producto.id}`}
                    key={producto.id}
                    onClick={() => dispatch(limpiarBusqueda())}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    {producto.imagen && (
                      <img
                        src={producto.imagen.url}
                        alt={producto.nombre}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-800">{producto.nombre}</span>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          {/*Carrito */}
          
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

          {/* Logout */}
          {usuario && (
            <div
              onClick={handleLogout}
              className="relative hover:text-gray-200 transition-colors cursor-pointer"
            >
              <img src='../../../../logout.svg' alt="icono contacto" className="h-6 w-6" />
            </div>
          )}

        </div>
        <div className="flex max-mm:hidden items-center space-x-4">

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

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`max-mm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        menuAbierto 
          ? 'max-h-96 opacity-100 transform translate-y-0' 
          : 'max-h-0 opacity-0 transform -translate-y-2'
      }`}>
        <div className="mt-4 pb-4 border-t border-white/20">
          <div className="mb-4 px-2" ref={containerRefMobile}>
            <div className={`flex items-center bg-white px-3 py-2 transition-all duration-200 ${
              resultados.length > 0 ? 'rounded-t-md' : 'rounded-md'
            }`}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={query}
                onChange={handleChange}
                className="bg-transparent text-gray-800 focus:outline-none w-full placeholder-gray-400"
              />
              {query ? (
                <button
                  onClick={() => {
                    dispatch(setTexto(''));
                    dispatch(setResultados([]));
                  }}
                  className="ml-2 text-gray-500 hover:cursor-pointer hover:text-red-600 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="ml-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
            </div>

            {resultados.length > 0 && (
              <ul className={`bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg overflow-hidden ${resultados.length > 4 ? 'max-h-64 overflow-y-auto' : ''
                }`}>
                {resultados.map((producto) => (
                  <Link
                    to={`/productos/${producto.id}`}
                    key={producto.id}
                    onClick={() => {
                      dispatch(limpiarBusqueda());
                      cerrarMenuMovil();
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    {producto.imagen && (
                      <img
                        src={producto.imagen.url}
                        alt={producto.nombre}
                        className="w-10 h-10 object-cover rounded-md border"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-800">{producto.nombre}</span>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
              onClick={cerrarMenuMovil}
            >
              Home
            </Link>
            <Link
              to="/productos"
              className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
              onClick={cerrarMenuMovil}
            >
              Galería
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
              onClick={cerrarMenuMovil}
            >
              Contacto
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 hover:bg-white/10 rounded transition-colors"
              onClick={cerrarMenuMovil}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClienteNavbar;