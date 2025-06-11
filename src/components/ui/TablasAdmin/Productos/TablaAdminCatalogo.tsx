import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchProducto, limpiarProductoActivo, setProductoActivo } from "../../../../redux/slices/productoSlice";
import { IProducto } from "../../../../types/IProducto";
import { productoService } from "../../../../services/productoService";
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
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);
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

  const toggleDescription = (productId: number) => {
    setExpandedDescriptions(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderDescription = (producto: IProducto) => {
    const maxLength = 50;
    const isExpanded = expandedDescriptions.includes(producto.id!);
    const description = producto.descripcion || '';
    
    if (description.length <= maxLength) {
      return description;
    }
    
    if (isExpanded) {
      return (
        <div>
          {description}
          <button 
            onClick={() => toggleDescription(producto.id!)}
            className="text-blue-600 hover:text-blue-800 ml-2 text-xs font-medium"
          >
            Ver menos
          </button>
        </div>
      );
    }
    
    return (
      <div>
        {description.substring(0, maxLength)}...
        <button 
          onClick={() => toggleDescription(producto.id!)}
          className="text-blue-600 hover:text-blue-800 ml-2 text-xs font-medium"
        >
          Ver más
        </button>
      </div>
    );
  };

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

  // Effect para cargar productos cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Catálogo") {
      cargarProductos()
    }
  }, [activeSubMenu]);

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">PRODUCTOS</h1>
          <button
            onClick={() => handleOpenModalCrear()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            + Crear producto
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  ID
                </th>
                <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Nombre
                </th>
                <th className="w-48 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Descripción
                </th>
                <th className="w-24 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Categoría
                </th>
                <th className="w-24 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Imagen
                </th>
                <th className="w-20 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Descuento
                </th>
                <th className="w-20 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Tipo
                </th>
                <th className="w-20 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Sexo
                </th>
                <th className="w-32 px-4 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No hay productos para mostrar
                  </td>
                </tr>
              ) : (
                productos.map((producto:IProducto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {producto.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {producto.nombre || 'Sin nombre'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {renderDescription(producto)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {producto.categoria?.nombre || "Sin definir"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {producto.imagen?.altDescripcion || "Sin definir"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {producto.descuento?.porcentaje || "Sin definir"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {producto.tipo || "Sin definir"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="break-words">
                        {producto.sexoProducto || "Sin definir"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          title="Ver"
                          onClick={() => handleOpenModalVer(producto)}
                          className="p-1.5 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200"
                        >
                          <IoEyeSharp size={16} />
                        </button>
                        <button
                          title="Editar"
                          onClick={() => handleOpenModalEdit(producto)}
                          className="p-1.5 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200"
                        >
                          <MdEdit size={16} />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleDelete(producto.id!)}
                          className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                        >
                          <IoTrashBinOutline size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {openModal && <ProductoModal activeProduct={productoActivo} openModalSee={openModalSee} handleCloseModal={handleCloseModal}/>}
    </>
  )
}