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
import { limpiarCarrito } from '../../../redux/slices/CarritoSlice';

const ClienteNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        limpiarCarrito();
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

        {/* Links y búsqueda - Centrados */}
        <div className="flex flex-1 justify-center items-center space-x-6">
          <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/productos" className="hover:text-gray-200 transition-colors">Galería</Link>
          {rolUsuario?.includes("ADMIN") && (
            <Link to="/admin" className="hover:text-gray-200 transition-colors">Admin</Link>
          )}

          {/*Barra de búsqueda */}
          <div className="hidden max-mm:flex items-center space-x-4">
            <div className="relative w-70" ref={containerRef}>
              <div className={`flex items-center p-90 bg-white px-3 py-2 transition-all duration-200 ${resultados.length > 0 ? 'rounded-t-md' : 'rounded-md'
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
          </div>

          {/*Dropdown responsive Search */}
        <div className="flex max-mm:hidden items-center space-x-4">

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </svg>
          </button>
        </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Usuario */}
          {usuario ? (
            <div className="relative">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                <div className="relative hover:text-gray-200 transition-colors cursor-pointer">
                  <img
                    src='../../../../editarUsuario.png'
                    alt="icono contacto"
                    className="h-6 w-6"
                  />
                </div>
              </div>

              {/* Dropdown de Usuario */}
              {isOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                    <div className="px-4 py-3 bg-zinc-100 border-b border-gray-300">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center hover:brightness-110 cursor-pointer transition-all">
                          <img
                            src='../../../../editarUsuario.png'
                            alt="icono contacto"
                            className="h-6 w-6 object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {usuario.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button 
                       onClick={() => navigate("/datos-usuario")}
                      className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 group">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-3.5 h-3.5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Editar perfil</p>
                          <p className="text-xs text-gray-500">Actualiza tu información</p>
                        </div>
                      </button>

                      <button className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 group">
                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mis pedidos</p>
                          <p className="text-xs text-gray-500">Historial de compras</p>
                        </div>
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-700">Cerrar sesión</p>
                          <p className="text-xs text-red-500">Salir de tu cuenta</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative">
              <div
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="relative hover:text-gray-200 transition-colors cursor-pointer">
                  <img
                    src='../../../../editarUsuario.png'
                    alt="icono contacto"
                    className="h-6 w-6"
                  />
                </div>
              </div>

              {isOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                    <div className="p-4 bg-gray-200 border-b border-gray-400">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">¡Bienvenido!</h3>
                      <p className="text-xs text-gray-600">Inicia sesión para acceder a tu cuenta</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 group"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Iniciar sesión</p>
                          <p className="text-xs text-gray-500">Accede a tu cuenta</p>
                        </div>
                      </button>

                      <button
                        onClick={() => navigate("/registro")}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-green-50 transition-colors duration-150 group"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <svg className="w-36 h-36 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 38 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Registrarse</p>
                          <p className="text-xs text-gray-500">Crea cuenta nueva</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

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
        </div>
      </div>

      <div className={`max-mm:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuAbierto
        ? 'max-h-96 opacity-100 transform translate-y-0'
        : 'max-h-0 opacity-0 transform -translate-y-2'
        }`}>
        <div className="mt-4 pb-1 border-t border-white/20">
          <div className="mb-4 px-2" ref={containerRefMobile}>
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
        </div>
      </div>
    </nav>
  );
};

export default ClienteNavbar;


