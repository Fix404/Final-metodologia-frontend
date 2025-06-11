import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { fetchProducto } from "../../../../redux/slices/productoSlice";
import { fetchColor, setColorActivo, limpiarColorActivo } from "../../../../redux/slices/colorSlice";
import { fetchCategoria, setCategoriaActivo, limpiarCategoriaActivo } from "../../../../redux/slices/categoriaSlice";
import { IProducto } from "../../../../types/IProducto";
import { ICategoria } from "../../../../types/ICategoria";
import { IColor } from "../../../../types/IColor";
import { IPrecio } from "../../../../types/IPrecio";
import { productoService } from "../../../../services/productoService";
import { colorService } from "../../../../services/colorService";
import { categoriaService } from "../../../../services/categoriaService";
import { detalleService } from "../../../../services/detalleService";
import { fetchDetalles } from "../../../../redux/slices/detalleProductoSlice";
import { CategoriaModal } from "../../Modals/AdminModals/CategoriaModal";
import { ColorModal } from "../../Modals/AdminModals/ColorModal";
import { PrecioModal } from "../../Modals/AdminModals/PrecioModal";
import { precioService } from "../../../../services/precioService";
import { fetchPrecio, limpiarPrecioActivo, setPrecioActivo } from "../../../../redux/slices/precioSlice";

type ModalType = 'categoria' | 'color' | 'precio' | null;

export const TablaAdminPrecios = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const productos = useSelector((state: RootState) => state.producto.productos);
  const colores = useSelector((state: RootState) => state.color.colores);
  const categorias = useSelector((state: RootState) => state.categoria.categorias);
  const precios = useSelector((state: RootState) => state.precio.precios);
  const detalles = useSelector((state: RootState) => state.detalleProducto.detalles);
  const categoriaActiva = useSelector((state: RootState) => state.categoria.categoriaActivo);
  const colorActivo = useSelector((state: RootState) => state.color.colorActivo);
  const precioActivo = useSelector((state: RootState) => state.precio.precioActivo);
  
  const [openModal, setOpenModal] = useState(false);
  const [openModalSee, setOpenModalSee] = useState(false);
  const [activeModalType, setActiveModalType] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias' | 'colores' | 'precios'>('productos');
  
  const dispatch = useDispatch();

  // Funciones de carga de datos
  const cargarProductos = async () => {
    try {
      const response = await productoService.obtenerProductos();
      dispatch(fetchProducto(response));
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const cargarColores = async () => {
    try {
      const response = await colorService.obtenerColores();
      dispatch(fetchColor(response));
    } catch (err) {
      console.error("Error al obtener colores:", err);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await categoriaService.obtenerCategorias();
      dispatch(fetchCategoria(response));
    } catch (error) {
      console.error("Error al obtener las categorías", error);
    }
  };

  const cargarPrecios = async () => {
    try {
      const response = await precioService.obtenerPrecios();
      dispatch(fetchPrecio(response));
    } catch (error) {
      console.error("Error al obtener los precios", error);
    }
  };

  const cargarDetalles = async () => {
    try {
      const response = await detalleService.obtenerDetalles();
      dispatch(fetchDetalles(response));
    } catch (error) {
      console.error("Error al obtener los detalles", error);
    }
  };

  // Funciones de modal - Categorías
  const handleOpenModalVerCategoria = (categoria: ICategoria) => {
    setOpenModalSee(true);
    dispatch(setCategoriaActivo(categoria));
    setActiveModalType('categoria');
    setOpenModal(true);
  };

  const handleOpenModalEditCategoria = (categoria: ICategoria) => {
    setOpenModalSee(false);
    dispatch(setCategoriaActivo(categoria));
    setActiveModalType('categoria');
    setOpenModal(true);
  };

  const handleOpenModalCrearCategoria = () => {
    dispatch(limpiarCategoriaActivo());
    setOpenModalSee(false);
    setActiveModalType('categoria');
    setOpenModal(true);
  };

  // Funciones de modal - Colores
  const handleOpenModalVerColor = (color: IColor) => {
    setOpenModalSee(true);
    dispatch(setColorActivo(color));
    setActiveModalType('color');
    setOpenModal(true);
  };

  const handleOpenModalEditColor = (color: IColor) => {
    setOpenModalSee(false);
    dispatch(setColorActivo(color));
    setActiveModalType('color');
    setOpenModal(true);
  };

  const handleOpenModalCrearColor = () => {
    dispatch(limpiarColorActivo());
    setOpenModalSee(false);
    setActiveModalType('color');
    setOpenModal(true);
  };

  // Funciones de modal - Precios
  const handleOpenModalVerPrecio = (precio: IPrecio) => {
    setOpenModalSee(true);
    dispatch(setPrecioActivo(precio));
    setActiveModalType('precio');
    setOpenModal(true);
  };

  const handleOpenModalEditPrecio = (precio: IPrecio) => {
    setOpenModalSee(false);
    dispatch(setPrecioActivo(precio));
    setActiveModalType('precio');
    setOpenModal(true);
  };

  const handleOpenModalCrearPrecio = () => {
    dispatch(limpiarPrecioActivo());
    setOpenModalSee(false);
    setActiveModalType('precio');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    dispatch(limpiarCategoriaActivo());
    dispatch(limpiarColorActivo());
    dispatch(limpiarPrecioActivo());
    setOpenModal(false);
    setActiveModalType(null);
    // Recargar datos según el tipo de modal que se cerró
    switch (activeModalType) {
      case 'categoria':
        cargarCategorias();
        break;
      case 'color':
        cargarColores();
        break;
      case 'precio':
        cargarPrecios();
        break;
    }
  };

  // Funciones de eliminación
  const handleEliminarCategoria = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        await categoriaService.eliminarCategoria(id);
        cargarCategorias();
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  const handleEliminarColor = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este color?')) {
      try {
        await colorService.eliminarColor(id);
        cargarColores();
      } catch (error) {
        console.error("Error al eliminar color:", error);
      }
    }
  };

  const handleEliminarPrecio = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este precio?')) {
      try {
        await precioService.eliminarPrecio(id);
        cargarPrecios();
      } catch (error) {
        console.error("Error al eliminar precio:", error);
      }
    }
  };

  // Función para obtener los detalles de un producto específico
  const obtenerDetallesProducto = (productoId: number) => {
    return detalles.filter(detalle => detalle.producto?.id === productoId);
  };

  // Crear filas de la tabla combinando productos con sus detalles
  const crearFilasTabla = () => {
    const filas: any[] = [];
    
    productos.forEach((producto: IProducto) => {
      const detallesProducto = obtenerDetallesProducto(producto.id!);
      
      if (detallesProducto.length === 0) {
        filas.push({
          id: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria?.nombre,
          descuento: producto.descuento?.porcentaje,
          precioVenta: "Sin definir",
          precioCompra: "Sin definir",
          talle: "Sin definir",
          color: "Sin definir"
        });
      } else {
        detallesProducto.forEach((detalle, index) => {
          filas.push({
            id: `${producto.id}-${index}`,
            productoId: producto.id,
            nombre: index === 0 ? producto.nombre : "",
            categoria: index === 0 ? producto.categoria?.nombre : "",
            descuento: index === 0 ? producto.descuento?.porcentaje : "",
            precioVenta: detalle.precio?.precioVenta || "Sin definir",
            precioCompra: detalle.precio?.precioCompra || "Sin definir",
            talle: detalle.talle?.talle || "Sin definir",
            color: detalle.color?.color || "Sin definir"
          });
        });
      }
    });
    
    return filas;
  };

  useEffect(() => {
    if (activeSubMenu === "Precios") {
      cargarProductos();
      cargarColores();
      cargarCategorias();
      cargarPrecios();
      cargarDetalles();
    }
  }, [activeSubMenu]);

  const filasTabla = crearFilasTabla();

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">GESTIÓN DE PRECIOS</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'productos', label: 'Productos' },
              { id: 'categorias', label: 'Categorías' },
              { id: 'colores', label: 'Colores' },
              { id: 'precios', label: 'Precios' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tabla de Productos */}
        {activeTab === 'productos' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Nombre</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Categoría</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Descuento</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Precio Venta</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Precio Compra</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Talle</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Color</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filasTabla.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No hay productos para mostrar
                      </td>
                    </tr>
                  ) : (
                    filasTabla.map((fila) => (
                      <tr key={fila.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{fila.productoId || fila.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.nombre || ''}</div></td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.categoria || "Sin definir"}</div></td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{fila.descuento || "Sin definir"}</td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.precioVenta}</div></td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.precioCompra}</div></td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.talle}</div></td>
                        <td className="px-4 py-4 text-sm text-gray-700"><div className="break-words">{fila.color}</div></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Categorías */}
        {activeTab === 'categorias' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleOpenModalCrearCategoria}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Crear Categoría
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Nombre</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Estado</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hay categorías para mostrar</td>
                    </tr>
                  ) : (
                    categorias.map((categoria) => (
                      <tr key={categoria.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{categoria.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{categoria.nombre}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {categoria.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModalVerCategoria(categoria)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleOpenModalEditCategoria(categoria)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarCategoria(categoria.id!)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Eliminar
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
        )}

        {/* Tabla de Colores */}
        {activeTab === 'colores' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleOpenModalCrearColor}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Crear Color
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Color</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Estado</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {colores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hay colores para mostrar</td>
                    </tr>
                  ) : (
                    colores.map((color) => (
                      <tr key={color.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{color.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{color.color}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {color.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModalVerColor(color)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleOpenModalEditColor(color)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarColor(color.id!)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Eliminar
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
        )}

        {/* Tabla de Precios */}
        {activeTab === 'precios' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={handleOpenModalCrearPrecio}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Crear Precio
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">ID</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Precio Venta</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Precio Compra</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Estado</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {precios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No hay precios para mostrar</td>
                    </tr>
                  ) : (
                    precios.map((precio) => (
                      <tr key={precio.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{precio.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">${precio.precioVenta}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">${precio.precioCompra}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${precio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {precio.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModalVerPrecio(precio)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleOpenModalEditPrecio(precio)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarPrecio(precio.id!)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Eliminar
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
        )}
      </div>

      {/* Modales */}
      {openModal && activeModalType === 'categoria' && (
        <CategoriaModal 
          activeCategoria={categoriaActiva} 
          openModalSee={openModalSee} 
          handleCloseModal={handleCloseModal} 
        />
      )}
      {openModal && activeModalType === 'color' && (
        <ColorModal 
          activeColor={colorActivo} 
          openModalSee={openModalSee} 
          handleCloseModal={handleCloseModal} 
        />
      )}
      {openModal && activeModalType === 'precio' && (
        <PrecioModal 
          activePrecio={precioActivo} 
          openModalSee={openModalSee} 
          handleCloseModal={handleCloseModal} 
        />
      )}
    </>
  );
};