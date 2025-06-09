import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { IOrdenCompra } from "../../../../types/IOrdenCompra";
import { ordenesCompraService } from "../../../../services/ordenesCompraService";

export const TablaAdminOrdCompra = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const [ordenesCompra, setOrdenesCompra] = useState<IOrdenCompra[]>([])

  // Función para cargar ordenesCompra
  const cargarOrdenesCompra = async () => {
            try {
                const response = await ordenesCompraService.obtenerOrdenesCompra()
                console.log("ordenes de Compra desde la API:", response.data);
                setOrdenesCompra(response.data);
            } catch (err) {
                console.error("Error al obtener ordenes de compra:", err);
            }
        };

  // Effect para cargar ordenesCompra cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Órdenes de compra") {
      cargarOrdenesCompra()
    }
  }, [activeSubMenu]);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>ID</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Fecha</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Movimiento</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Precio total</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Cantidad de ordenCompra</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>ID Usuario</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {ordenesCompra.length === 0 ? (
          <tr>
            <td className="py-8 px-4 text-center text-gray-500 border-b">
              No hay órdenes de compra para mostrar
            </td>
          </tr>
        ) : (
          ordenesCompra.map((ordenCompra:IOrdenCompra) => (
            <tr key={ordenCompra.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b font-medium">
                {ordenCompra.id}
              </td>
              <td className="py-2 px-4 border-b">
                {ordenCompra.fecha || 'Sin nombre'}
              </td>
              {/* <td className="py-2 px-4 border-b">
                {ordenCompra.movimiento}
              </td> */}
              <td className="py-2 px-4 border-b">
                {ordenCompra.total || "Sin definir"}
              </td>
              {/* <td className="py-2 px-4 border-b">
                {ordenCompra.cantidad || "Sin definir"}
              </td> */}
              <td className="py-2 px-4 border-b">
               {ordenCompra.usuario?.id || "Sin definir"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  )
}