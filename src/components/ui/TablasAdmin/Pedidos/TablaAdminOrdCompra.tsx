import { useEffect, useState } from "react";
import React from "react";
import { useAppSelector, useAppDispatch } from "../../../../hooks/redux";
import { IOrdenCompra } from "../../../../types/IOrdenCompra";
import { IProductoCantidad } from "../../../../types/IProductoCantidad";
import { fetchOrdenesCompra } from "../../../../redux/slices/ordenesCompraSlice";

export const TablaAdminOrdCompra = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const { ordenes, loading, error } = useAppSelector(
    (state) => state.ordenesCompra
  );
  const dispatch = useAppDispatch();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activeSubMenu === "Órdenes de compra") {
      dispatch(fetchOrdenesCompra());
    }
  }, [activeSubMenu, dispatch]);

  const toggleOrderExpansion = (ordenId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(ordenId)) {
      newExpanded.delete(ordenId);
    } else {
      newExpanded.add(ordenId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatFecha = (fechaCompleta: string) => {
    const fecha = new Date(fechaCompleta);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHora = (fechaCompleta: string) => {
    const fecha = new Date(fechaCompleta);
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTotalProductos = (productoCantidad: IProductoCantidad[]) => {
    return productoCantidad.reduce((total, item) => total + item.cantidad, 0);
  };

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
                  ID de Compra
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Hora
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Productos
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Cargando órdenes...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-600">
                    Error: {error}
                  </td>
                </tr>
              ) : ordenes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay órdenes de compra para mostrar
                  </td>
                </tr>
              ) : (
                ordenes.map((orden: IOrdenCompra) => {
                  const isExpanded = expandedOrders.has(orden.id);
                  const totalProductos = getTotalProductos(orden.productoCantidad);
                  
                  return (
                    <React.Fragment key={orden.id}>
                      {/* Fila principal de la orden */}
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {orden.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          { orden.usuario?.email || 'Usuario desconocido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatFecha(orden.fecha)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatHora(orden.fecha)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center">
                            {orden.productoCantidad.length > 1 && (
                              <button
                                onClick={() => toggleOrderExpansion(orden.id)}
                                className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <svg
                                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {totalProductos} productos
                              </span>
                              {orden.productoCantidad.length > 1 && (
                                <button
                                  onClick={() => toggleOrderExpansion(orden.id)}
                                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                                >
                                  {isExpanded ? 'Ocultar' : 'Ver detalles'}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="font-medium">${orden.precioTotal.toLocaleString()}</span>
                        </td>
                      </tr>

                      {/* Filas expandidas con los productos */}
                      {isExpanded && orden.productoCantidad.map((productoCant: IProductoCantidad) => (
                        <tr key={`producto-${productoCant.id}`} className="bg-gray-50">
                          <td className="px-6 py-2 text-sm text-gray-600 pl-12">
                            <span className="text-xs text-gray-500">Producto #{productoCant.id}</span>
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-600"></td>
                          <td className="px-6 py-2 text-sm text-gray-600"></td>
                          <td className="px-6 py-2 text-sm text-gray-600"></td>
                          <td className="px-6 py-2 text-sm text-gray-600">
                            <div className="text-xs">
                              <div className="font-medium text-gray-800 mb-1">
                                {productoCant.detalle?.producto?.nombre || 'Producto sin nombre'}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-1">
                                <span className="inline-flex px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                                  {productoCant.detalle?.talle?.talle || "S/T"}
                                </span>
                                <span className="inline-flex px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">
                                  {productoCant.detalle?.color?.color || "S/C"}
                                </span>
                              </div>
                              <div>Cantidad: <span className="font-medium">{productoCant.cantidad}</span></div>
                            </div>
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-600">
                            <div className="text-xs">
                              <div>Precio unit.: <span className="font-medium">${productoCant.detalle?.precio?.precioVenta || "N/A"}</span></div>
                              <div>Subtotal: <span className="font-medium">${((productoCant.detalle?.precio?.precioVenta || 0) * productoCant.cantidad).toLocaleString()}</span></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};