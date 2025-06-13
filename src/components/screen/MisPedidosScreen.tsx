import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { IOrdenCompra } from "../../types/IOrdenCompra";
import { IProductoCantidad } from "../../types/IProductoCantidad";
import { fetchOrdenesCompra } from "../../redux/slices/ordenesCompraSlice";

export const MisPedidosScreen: React.FC = () => {
  const { ordenes, loading, error } = useAppSelector(
    (state) => state.ordenesCompra
  );
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Filtrar órdenes del usuario logueado
  const misOrdenes = ordenes.filter((orden: IOrdenCompra) => 
    orden.usuario?.id === usuario?.id
  );

  useEffect(() => {
    dispatch(fetchOrdenesCompra());
  }, [dispatch]);

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

  if (!usuario) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Debes iniciar sesión para ver tus pedidos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">MIS PEDIDOS</h1>
          <p className="text-gray-600">Aquí puedes ver el historial de todas tus compras</p>
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
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Hora
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Cargando tus pedidos...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                      Error: {error}
                    </td>
                  </tr>
                ) : misOrdenes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500 mb-2">No tienes pedidos realizados</p>
                        <p className="text-sm text-gray-400">¡Explora nuestros productos y realiza tu primera compra!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  misOrdenes.map((orden: IOrdenCompra) => {
                    const isExpanded = expandedOrders.has(orden.id);
                    const totalProductos = getTotalProductos(orden.productoCantidad);
                    
                    return (
                      <React.Fragment key={orden.id}>
                        {/* Fila principal de la orden */}
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{orden.id}
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
                                  {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'}
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
                            <span className="font-medium text-lg text-green-600">
                              ${orden.precioTotal.toLocaleString()}
                            </span>
                          </td>
                        </tr>

                        {/* Filas expandidas con los productos */}
                        {isExpanded && orden.productoCantidad.map((productoCant: IProductoCantidad) => (
                          <tr key={`producto-${productoCant.id}`} className="bg-gray-50">
                            <td className="px-6 py-2 text-sm text-gray-600 pl-12">
                              <span className="text-xs text-gray-500">Item #{productoCant.id}</span>
                            </td>
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
                                <div className="font-medium text-sm">Subtotal: <span className="text-green-600">${((productoCant.detalle?.precio?.precioVenta || 0) * productoCant.cantidad).toLocaleString()}</span></div>
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

        {/* Estadísticas rápidas */}
        {misOrdenes.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{misOrdenes.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total gastado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${misOrdenes.reduce((total, orden) => total + orden.precioTotal, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Productos comprados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {misOrdenes.reduce((total, orden) => total + getTotalProductos(orden.productoCantidad), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};