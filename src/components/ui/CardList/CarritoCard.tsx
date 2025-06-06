import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IDetalle } from '../../../types/IDetalle';
import { 
  quitarDelCarrito, 
  aumentarCantidad, 
  disminuirCantidad 
} from '../../../redux/slices/CarritoSlice';
import { restaurarStock } from '../../../redux/slices/detalleProductoSlice';
import { FaTrash, FaPlus, FaMinus, FaPrint } from 'react-icons/fa';

interface CarritoCardProps {
  detalle: IDetalle;
  cantidad: number;
}

export const CarritoCard: React.FC<CarritoCardProps> = ({ detalle, cantidad }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuitar = () => {
    dispatch(quitarDelCarrito(detalle.id));
    dispatch(restaurarStock(detalle.id));
  };

  const handleAumentarCantidad = () => {
    if (cantidad < detalle.stock) {
      dispatch(aumentarCantidad(detalle.id));
    }
  };

  const handleDisminuirCantidad = () => {
    if (cantidad > 1) {
      dispatch(disminuirCantidad(detalle.id));
    }
  };

  const handleNavegacionProducto = () => {
    navigate(`/producto/${detalle.producto.id}`);
  };

  const calcularPrecioFinal = () => {
    const precioBase = detalle.precio.precioVenta;
    const descuento = detalle.producto.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  const calcularSubtotal = () => {
    return calcularPrecioFinal() * cantidad;
  };

  const precioFinal = calcularPrecioFinal();
  const subtotal = calcularSubtotal();

  return (
    <div className="bg-[#fdfae8] border-b border-gray-300 py-6">
      <div className="flex items-start gap-4">
        {/* Imagen del producto - clickeable */}
        <div 
          className="w-24 h-24 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleNavegacionProducto}
        >
          <img
            src={detalle.producto.imagen.url}
            alt={detalle.producto.imagen.altDescripcion}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              {/* Nombre del producto - clickeable */}
              <h3 
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleNavegacionProducto}
              >
                {detalle.producto.nombre}
              </h3>
              
              {/* Descripción */}
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {detalle.producto.descripcion}
              </p>
            </div>

            {/* Botón imprimir (como en el diseño) */}
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 ml-2"
              title="Imprimir"
            >
              <FaPrint className="text-sm" />
            </button>
          </div>

          {/* Detalles: Color y Talle */}
          <div className="flex gap-4 text-sm text-gray-600 mb-3">
            <span>Color: <strong>{detalle.color.color}</strong></span>
            <span>Talle: <strong>{detalle.talle.talle}</strong></span>
          </div>

          {/* Fila inferior: Cantidad, Precio y Eliminar */}
          <div className="flex items-center justify-between">
            {/* Control de cantidad */}
            <div className="flex items-center bg-[#4A90E2] rounded overflow-hidden">
              <button
                onClick={handleDisminuirCantidad}
                disabled={cantidad <= 1}
                className="text-white p-2 hover:bg-[#357ABD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaMinus className="text-xs" />
              </button>
              
              <span className="text-white px-4 py-2 font-medium min-w-[40px] text-center">
                {cantidad}
              </span>
              
              <button
                onClick={handleAumentarCantidad}
                disabled={cantidad >= detalle.stock}
                className="text-white p-2 hover:bg-[#357ABD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>

            {/* Precio */}
            <div className="text-right flex-1 mx-4">
              {detalle.producto.descuento ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm line-through text-gray-500">
                      ${detalle.precio.precioVenta.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 font-semibold">
                      -{detalle.producto.descuento.porcentaje}%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    ${subtotal.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-800">
                  ${subtotal.toLocaleString()}
                </div>
              )}
              
              {/* Indicador de stock bajo */}
              {detalle.stock <= 3 && (
                <p className="text-xs text-orange-500 mt-1">
                  ¡Solo quedan {detalle.stock}!
                </p>
              )}
            </div>

            {/* Botón eliminar */}
            <button
              onClick={handleQuitar}
              className="text-gray-400 hover:text-red-500 p-2 transition-colors"
              title="Eliminar del carrito"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};