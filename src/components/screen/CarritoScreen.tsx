import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IDetalle } from "../../types/IDetalle";
import { quitarDelCarrito } from "../../redux/slices/CarritoSlice";
import { restaurarStock } from "../../redux/slices/detalleProductoSlice";
import { useDispatch } from 'react-redux';

export const CarritoScreen: React.FC = () => {
  const items = useSelector((state: RootState) => state.carrito.items);
  const dispatch = useDispatch();

  const handleQuitar = (detalleId: number) => {
    dispatch(quitarDelCarrito(detalleId));
    dispatch(restaurarStock(detalleId));
  };

  return (
    <div>
      <h2>Mi Carrito</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((detalle: IDetalle, index: number) => (
            <div key={index} className="flex flex-col p-2 border rounded">
              <p className="font-bold">{detalle.producto.nombre}</p>
              <p>{detalle.producto.descripcion}</p>
              <img
                src={detalle.producto.imagen.url}
                alt={detalle.producto.imagen.altDescripcion}
              />
              <p>{detalle.color.color}</p>
              <p>{detalle.talle.talle}</p>

              <p>${detalle.precio.precioVenta.toLocaleString()}</p>
              <button
                onClick={() => handleQuitar(detalle.id)}>
                Quitar
              </button>
            </div>
          ))
        ) : (
          <p>Carrito vacío</p>
        )}
      </div>
    </div>
  );
};

