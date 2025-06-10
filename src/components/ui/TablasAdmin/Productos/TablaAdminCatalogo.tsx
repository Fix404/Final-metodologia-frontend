import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchProducto, limpiarProductoActivo, setProductoActivo } from "../../../../redux/slices/productoSlice";
import { IProducto } from "../../../../types/IProducto";
import { productoService } from "../../../../services/productoService";
import { RiProhibitedLine } from "react-icons/ri";
import { IoEyeSharp, IoTrashBinOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { ProductoModal } from "../../Modals/AdminModals/ProductoModal";

export const TablaAdminCatalogo = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const productos = useSelector((state: RootState) => state.producto.productos);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openModalSee, setOpenModalSee] = useState(false);
  const productoActivo=useAppSelector((state) => state.producto.productoActivo);

  // Función para cargar productos
  const cargarProductos = async () => {

            try {
                const response = await productoService.obtenerProductosActivos();
                console.log("Productos desde la API:", response);
                dispatch(fetchProducto(response));
            } catch (err) {
                console.error("Error al obtener productos:", err);
            }
  };
  const handleOpenModalVer=(producto: IProducto) =>{
      setOpenModalSee(true);
      dispatch(setProductoActivo(producto))
      setOpenModal(true);
    }
  
    const handleOpenModalEdit=(producto: IProducto) =>{
      setOpenModalSee(false);
      dispatch(setProductoActivo(producto))
      setOpenModal(true);
    }
  
    const handleOpenModalCrear = () => {
  dispatch(limpiarProductoActivo());
  setOpenModalSee(false);
  setOpenModal(true);
}
  
    const handleCloseModal= () => {
      dispatch(limpiarProductoActivo())
      setOpenModal(false);
      cargarProductos()
    }

    const handleDelete = async (id: number) => {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción deshabilitará al producto.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, deshabilitar',
        cancelButtonText: 'Cancelar'
      });
    
      if (resultado.isConfirmed) {
        try {
          await productoService.eliminarProducto(id);
    
          Swal.fire('Deshabilitado', 'El Producto fue deshabilitado exitosamente.', 'success');
          cargarProductos()
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al deshabilitar el Producto.', 'error');
          console.error("Hubo un error al borrar el Producto", error);
        }
      }
    };

    const cambiarDisponible = async (idProducto: number, producto: IProducto) => {
  try {
    const ProductoActualizado: IProducto = { 
      ...producto, 
      disponible: !producto.disponible 
    };
    
    const data = await productoService.actualizarProducto(
      idProducto, 
      ProductoActualizado
    );
    console.log(data);
  } catch (error) {
    console.log("Hubo un error", error);
  }
};

  // Effect para cargar productos cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Catálogo") {
      cargarProductos()
    }
  }, [activeSubMenu]);
  return (
    <>
    <div className="overflow-x-auto">
      <div className="text-4xl font-bold justify-self-center py-7">
        <h1>PRODUCTOS</h1>
      </div>
      <button
              onClick={() => handleOpenModalCrear()}
              className="bg-blue-700 hover:bg-blue-500 text-white text-3xl font-semibold py-1 px-2 cursor-pointer rounded shadow-md transition"
            >
              <p>Crear producto</p>
            </button>
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
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Disponible</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Acciones</p>
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
              <td className="py-2 px-4 border-b">
               {(producto.disponible ? "A la venta":"No se vende")}
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex justify-center gap-2">
                  <button
                  title="Hacer no disponible"
                    onClick={() => cambiarDisponible(producto.id!, producto)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <RiProhibitedLine />
                  </button>
                  <button
                  title="Ver"
                    onClick={() => handleOpenModalVer(producto)}
                    className="bg-green-500 hover:bg-green-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <IoEyeSharp />
                  </button>
                  <button
                    title="Editar"
                    onClick={() => handleOpenModalEdit(producto)}
                    className="bg-purple-500 hover:bg-purple-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <MdEdit />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => handleDelete(producto.id!)}
                    className="bg-red-500 hover:bg-red-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <IoTrashBinOutline />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
    {openModal && <ProductoModal activeProduct={productoActivo} openModalSee={openModalSee} handleCloseModal={handleCloseModal}/>}
    </>
  )
}