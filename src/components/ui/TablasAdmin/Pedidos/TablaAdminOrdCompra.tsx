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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">ÓRDENES DE COMPRA</h1>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Precio total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Cantidad de producto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Cargando órdenes...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-600">
                    Error: {error}
                  </td>
                </tr>
              ) : ordenes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No hay órdenes de compra para mostrar
                  </td>
                </tr>
              ) : (
                ordenes.map((orden: IOrdenCompra) => (
                  <tr key={orden.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {orden.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {orden.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${orden.precio_total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {orden.producto_cantidad_id.cantidad}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};