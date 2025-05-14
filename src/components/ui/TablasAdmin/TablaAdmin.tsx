export const TablaAdmin = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>ID</p>
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>Nombre</p>
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>Email</p>
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>Dirección</p>
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>Estado</p>
            </th>
            <th className="py-3 px-4 text-left font-semibold border-b">
              <p>Pedido</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí irían tus filas de datos */}
          {/* Ejemplo de fila: */}
          <tr className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">001</td>
            <td className="py-2 px-4 border-b">Juan Pérez</td>
            <td className="py-2 px-4 border-b">juan@ejemplo.com</td>
            <td className="py-2 px-4 border-b">Calle Principal 123</td>
            <td className="py-2 px-4 border-b">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
            </td>
            <td className="py-2 px-4 border-b">#ORD-2023-001</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}