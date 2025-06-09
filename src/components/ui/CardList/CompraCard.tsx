import React from "react";
import { IDetalle } from "../../../types/IDetalle";

interface CompraCardProps {
  detalle: IDetalle;
  cantidad: number;
}

export const CompraCard: React.FC<CompraCardProps> = ({
  detalle,
  cantidad,
}) => {
  const calcularPrecioFinal = () => {
    const precioBase = detalle.precio.precioVenta;
    const descuento = detalle.producto.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  const precioFinal = calcularPrecioFinal();
  const subtotal = precioFinal * cantidad;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0">
      {/* Imagen pequeña */}
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={detalle.producto.imagen.url}
          alt={detalle.producto.imagen.altDescripcion}
          className="w-full h-full object-contain rounded"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">
          {detalle.producto.nombre}
        </h4>
        
        <div className="flex text-xs text-gray-600 mt-1 gap-2">
          <span>{detalle.color.color}</span>
          <span>·</span>
          <span>Talle {detalle.talle.talle}</span>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-600">Cantidad: {cantidad}</span>
          
          {detalle.producto.descuento ? (
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-xs line-through text-gray-500">
                  ${detalle.precio.precioVenta.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  -{detalle.producto.descuento.porcentaje}%
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800">
                ${subtotal.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-sm font-medium text-gray-800">
              ${subtotal.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};