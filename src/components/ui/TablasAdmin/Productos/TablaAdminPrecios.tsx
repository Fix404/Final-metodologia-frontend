import { useEffect } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import axios from "axios";
import { fetchProducto } from "../../../../redux/slices/productoSlice";
import { IProducto } from "../../../../types/IProducto";

export const TablaAdminPrecios = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const productos = useSelector((state: RootState) => state.producto.productos);
  const dispatch = useDispatch();

  // Función para cargar productos
  const fetchProducts = async () => {

            try {
                const response = await axios.get("http://localhost:8080/productos");
                console.log("Productos desde la API:", response.data);
                dispatch(fetchProducto(response.data));
            } catch (err) {
                console.error("Error al obtener productos:", err);
            }
        };

  // Effect para cargar productos cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Catálogo") {
      fetchProducts()
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
            <p>Nombre del producto</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Descripción</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Categoría</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Imagen</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Descuento</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Tipo</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Sexo</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {productos.length === 0 ? (
          <tr>
            <td className="py-8 px-4 text-center text-gray-500 border-b">
              No hay productos para mostrar
            </td>
          </tr>
        ) : (
          productos.map((producto:IProducto) => (
            <tr key={producto.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b font-medium">
                {producto.id}
              </td>
              <td className="py-2 px-4 border-b">
                {producto.nombre || 'Sin nombre'}
              </td>
              <td className="py-2 px-4 border-b">
                {producto.descripcion}
              </td>
              <td className="py-2 px-4 border-b">
                {producto.categoria?.nombre || "Sin definir"}
              </td>
              <td className="py-2 px-4 border-b">
                {producto.imagen?.altDescripcion || "Sin definir"}
              </td>
              <td className="py-2 px-4 border-b">
               {producto.descuento?.porcentaje || "Sin definir"}
              </td>
              <td className="py-2 px-4 border-b">
               {producto.tipo || "Sin definir"}
              </td>
              <td className="py-2 px-4 border-b">
               {producto.sexoProducto || "Sin definir"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  )
}