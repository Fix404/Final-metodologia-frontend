import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IDetalle } from "../../../types/IDetalle";
import { restaurarStock } from "../../../redux/slices/detalleProductoSlice";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  aumentarCantidad,
  disminuirCantidad,
  quitarDelCarrito,
} from "../../../redux/slices/CarritoSlice";

interface CarritoCardProps {
  detalle: IDetalle;
  cantidad: number;
}

export const CarritoCard: React.FC<CarritoCardProps> = ({
  detalle,
  cantidad,
}) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuitar = () => {
    for (let i = 0; i < cantidad; i++) {
      dispatch(quitarDelCarrito(detalle.id));
      dispatch(restaurarStock(detalle.id));
    }
  };

  const handleAumentarCantidad = () => {
    if (cantidad < detalle.stock!) {
      dispatch(aumentarCantidad(detalle.id));
    }
  };

  const handleDisminuirCantidad = () => {
    if (cantidad > 1) {
      dispatch(disminuirCantidad(detalle.id));
    }
  };

  const handleNavegacionProducto = () => {
    navigate(`/productos/${detalle.producto.id}`);
  };

  const calcularPrecioFinal = () => {
    const precioBase = detalle.precio.precioVenta;
    const descuento = detalle.producto.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  const precioFinal = calcularPrecioFinal();
  const subtotal = precioFinal * cantidad;

  return (
    <div className="bg-white border-b border-gray-300 shadow-xl py-6 px-2 sm:px-4">
      <div className="flex gap-4">
        {/* Imagen */}
        <div
          className="w-24 h-24 flex-shrink-0 cursor-pointer"
          onClick={handleNavegacionProducto}
        >
          <img
            src={detalle.producto.imagen?.url}
            alt={detalle.producto.imagen?.altDescripcion??'Sin imagen'}
            className="w-full h-full object-contain rounded"
          />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">

          {/* Header: título + eliminar */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3
                className="text-lg w-46 font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                onClick={handleNavegacionProducto}
              >
                {detalle.producto.nombre}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {detalle.producto.descripcion}
              </p>
            </div>
            <button
              onClick={handleQuitar}
              className="text-red-500 hover:text-red-700 hover:cursor-pointer p-2 transition"
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>

          {/* Color y talle */}
          <div className="flex gap-4 text-sm text-gray-600 mt-3">
            <span>
              Color: <strong>{detalle.color.color}</strong>
            </span>
            <span>
              Talle: <strong>{detalle.talle.talle}</strong>
            </span>
          </div>

          {/* Controles y precio */}
          <div className="mt-4 flex justify-between items-center flex-wrap gap-3">
            <div className="inline-flex items-center bg-[#4782c5ee] px-2 rounded overflow-hidden">
              <button
                onClick={handleDisminuirCantidad}
                disabled={cantidad <= 1}
                className="text-white p-2 hover:bg-[#357ABD] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="text-white w-[40px] py-2 font-medium text-center">
                {cantidad}
              </span>
              <button
                onClick={handleAumentarCantidad}
                disabled={cantidad >= detalle.stock!}
                className="text-white p-2 hover:bg-[#357ABD] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPlus className="text-xs" />
              </button>
            </div>


            <div className="text-right flex-1">
              {detalle.producto.descuento ? (
                <div >
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

              {detalle.stock! <= 3 && (
                <p className="text-xs text-orange-500 mt-1">
                  ¡Solo quedan {detalle.stock}!
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
