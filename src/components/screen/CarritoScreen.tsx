import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CarritoCard } from "../ui/CardList/CarritoCard";
import { FaShoppingBag } from "react-icons/fa";
import { IDetalle } from "../../types/IDetalle";
import Swal from "sweetalert2";

const fetchDetalleById = async (detalleId: number): Promise<IDetalle> => {
  try {
    const response = await fetch(`http://localhost:8080/detalle/${detalleId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalle ${detalleId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching detalle ${detalleId}:`, error);
    throw error;
  }
};

export const CarritoScreen: React.FC = () => {
  const items = useSelector((state: RootState) => state.carrito.items);
  const usuario = useSelector((state: RootState) => state.auth.usuario);

  const navigate = useNavigate();
  
  // Estados para manejar los datos actualizados del backend
  const [detallesActualizados, setDetallesActualizados] = useState<IDetalle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar detalles actualizados desde el backend
  useEffect(() => {
    const loadDetallesActualizados = async () => {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Obtener todos los detalles actualizados del backend
        const promesas = items.map(item => fetchDetalleById(item.detalle.id));
        const detallesFromAPI = await Promise.all(promesas);
        
        setDetallesActualizados(detallesFromAPI);
      } catch (err) {
        setError('Error al cargar los detalles actualizados del carrito');
        console.error('Error loading detalles actualizados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetallesActualizados();
  }, [items]);

  // Calcular precio final con descuentos
  const calcularPrecioFinal = (detalle: IDetalle) => {
    const precioBase = detalle.precio?.precioVenta || 0;
    const descuento = detalle.producto?.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  // Calcular el total del carrito 
  const calcularTotal = () => {
    return items.reduce((total, itemCarrito) => {
      const detalleActualizado = detallesActualizados.find(
        d => d.id === itemCarrito.detalle.id
      );
      
      if (detalleActualizado) {
        return total + calcularPrecioFinal(detalleActualizado) * itemCarrito.cantidad;
      }

      return total + calcularPrecioFinal(itemCarrito.detalle) * itemCarrito.cantidad;
    }, 0);
  };

  const handleComprar = () => {
 if (!usuario){

 Swal.fire({
      title: '¡Inicia sesión!',
      text: 'Debes estar logueado para continuar con la compra.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ir al login',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4A90E2',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
    return;
  }
    navigate("/comprar");
  };

  const handleContinuarComprando = () => {
    navigate("/productos");
  };

  // Mostrar loading mientras se cargan los datos del backend
  if (loading && items.length > 0) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4577] mx-auto mb-4"></div>
          <p className="text-gray-600">Actualizando carrito...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurrió algún problema al cargar desde el backend
  if (error) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1c4577] text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#fcfcd3] min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <FaShoppingBag className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Agrega algunos productos para continuar con tu compra
          </p>
          <button
            onClick={handleContinuarComprando}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">MI CARRITO</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {items.map(({ detalle, cantidad }) => {
            // Buscar el detalle actualizado del backend
            const detalleActualizado = detallesActualizados.find(d => d.id === detalle.id);
            
            return (
              <CarritoCard 
                key={detalle.id} 
                detalle={detalleActualizado || detalle} // Usar datos actualizados o fallback
                cantidad={cantidad} 
              />
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-semibold text-gray-800">TOTAL:</span>
              <span className="text-3xl font-bold text-gray-800">
                ${calcularTotal().toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleContinuarComprando}
                className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300"
              >
                Continuar Comprando
              </button>

              <button
                onClick={handleComprar}
                className="bg-[#4A90E2] hover:bg-[#357ABD] hover:cursor-pointer text-white font-semibold py-3 px-8 rounded-lg transition-colors min-w-[160px]"
              >
                COMPRAR
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2">
              <span>Total de productos: {items.length}</span>
              <span>
                Total de artículos: {items.reduce((acc, item) => acc + item.cantidad, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};