import { useEffect, useState } from "react";
import { useAppSelector , useAppDispatch} from "../../../../hooks/redux";
import { IOrdenCompra } from "../../../../types/IOrdenCompra";
import { fetchOrdenesCompra } from "../../../../redux/slices/ordenesCompraSlice";


export const TablaAdminOrdCompra = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const { ordenes, loading, error } = useAppSelector(
    (state) => state.ordenesCompra
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeSubMenu === "Órdenes de compra") {
      dispatch(fetchOrdenesCompra());
    }
  }, [activeSubMenu, dispatch]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b">ID</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Fecha</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Precio total</th>
            <th className="py-3 px-4 text-left font-semibold border-b">Cantidad de producto</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-8 px-4 text-center text-gray-500 border-b">
                Cargando órdenes...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="py-8 px-4 text-center text-red-600 border-b">
                Error: {error}
              </td>
            </tr>
          ) : ordenes.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 px-4 text-center text-gray-500 border-b">
                No hay órdenes de compra para mostrar
              </td>
            </tr>
          ) : (
            ordenes.map((orden: IOrdenCompra) => (
              <tr key={orden.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b font-medium">{orden.id}</td>
                <td className="py-2 px-4 border-b">{orden.fecha}</td>
                <td className="py-2 px-4 border-b">${orden.precio_total.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{orden.producto_cantidad_id.cantidad}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};