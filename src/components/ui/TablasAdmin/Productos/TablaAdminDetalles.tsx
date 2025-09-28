import { useEffect, useState } from "react";
import React from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { limpiarColorActivo } from "../../../../redux/slices/colorSlice";
import { limpiarCategoriaActivo } from "../../../../redux/slices/categoriaSlice";
import { IDetalle } from "../../../../types/IDetalle";
import { CategoriaModal } from "../../Modals/AdminModals/CategoriaModal";
import { ColorModal } from "../../Modals/AdminModals/ColorModal";
import { PrecioModal } from "../../Modals/AdminModals/PrecioModal";
import { limpiarPrecioActivo } from "../../../../redux/slices/precioSlice";
import { DetalleModal} from "../../Modals/AdminModals/DetalleModal";
import { cargarCategorias, cargarColores, cargarDetalles, cargarPrecios, cargarProductos } from "../../../../utils/tablaDetalleUtils";
import { useTablaDetalleHandlers } from "../../../../hooks/useTablaDetalleHandlers";
import { limpiarDetalleActivo } from "../../../../redux/slices/detalleProductoSlice";
import { GiAngelOutfit } from "react-icons/gi";

type ModalType = 'categoria' | 'color' | 'precio' | 'detalle'| null;

export const TablaAdminDetalles = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const productos = useSelector((state: RootState) => state.producto.productos);
  const colores = useSelector((state: RootState) => state.color.colores);
  const categorias = useSelector((state: RootState) => state.categoria.categorias);
  const precios = useSelector((state: RootState) => state.precio.precios);
  const detalles = useSelector((state: RootState) => state.detalleProducto.detalles);
  const categoriaActiva = useSelector((state: RootState) => state.categoria.categoriaActivo);
  const colorActivo = useSelector((state: RootState) => state.color.colorActivo);
  const precioActivo = useSelector((state: RootState) => state.precio.precioActivo);
  const detalleActivo=useSelector((state: RootState) => state.detalleProducto.detalleActivo);

  const [openModal, setOpenModal] = useState(false);
  const [openModalSee, setOpenModalSee] = useState(false);
  const [activeModalType, setActiveModalType] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<'detalle' | 'categorias' | 'colores' | 'precios'>('detalle');
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

  const {handleOpenModalCrearDetalle,handleOpenModalVerCategoria,handleOpenModalCrearCategoria,
    handleOpenModalCrearColor,
    handleOpenModalCrearPrecio,
    handleOpenModalEditCategoria,
    handleOpenModalEditColor,
    handleOpenModalEditPrecio,
    handleOpenModalVerColor,
    handleOpenModalVerPrecio, handleEliminarCategoria,
    handleEliminarColor, handleEliminarPrecio, handleEliminarDetalle, handleRestoreDetalle,
    handleRestoreCategoria, handleRestorePrecio, handleRestoreColor,
    handleOpenModalEditDetalle} = useTablaDetalleHandlers({
  setOpenModal,
  setOpenModalSee,
  setActiveModalType,
});
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(limpiarCategoriaActivo());
    dispatch(limpiarColorActivo());
    dispatch(limpiarPrecioActivo());
    dispatch(limpiarDetalleActivo())
    setOpenModal(false);
    setActiveModalType(null);

    switch (activeModalType) {
      case 'categoria':
        cargarCategorias(dispatch);
        break;
      case 'color':
        cargarColores(dispatch);
        break;
      case 'precio':
        cargarPrecios(dispatch);
        break;
        case 'detalle':
        cargarDetalles(dispatch);
        break;
    }
  };

  

  const toggleProductExpansion = (productoId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productoId)) {
      newExpanded.delete(productoId);
    } else {
      newExpanded.add(productoId);
    }
    setExpandedProducts(newExpanded);
  };

  const getProductosConDetalles = () => {
    const productosMap = new Map();
    
    // Primero, agregar todos los productos
    productos.forEach(producto => {
      productosMap.set(producto.id!, {
        producto,
        detalles: []
      });
    });
    
    // Luego, agrupar los detalles por producto
    detalles.forEach(detalle => {
      if (detalle.producto?.id && productosMap.has(detalle.producto.id)) {
        productosMap.get(detalle.producto.id).detalles.push(detalle);
      }
    });
    
    return Array.from(productosMap.values());
  };

  useEffect(() => {
    if (activeSubMenu === "Detalles de productos") {
      cargarProductos(dispatch);
      cargarColores(dispatch);
      cargarCategorias(dispatch);
      cargarPrecios(dispatch);
      cargarDetalles(dispatch);
    }
  }, [activeSubMenu]);

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Detalles de productos</h1>
          <button
            onClick={() => handleOpenModalCrearDetalle()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          >
            + Crear Detalle
          </button>
        </div>
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'detalle', label: 'Detalles de productos' },
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
        {activeTab === 'detalle' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Producto</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Categoría</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Total Opciones</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Stock Total</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Rango Precios</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getProductosConDetalles().length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No hay productos para mostrar
                      </td>
                    </tr>
                  ) : (
                    getProductosConDetalles().map(({ producto, detalles: productDetalles }) => {
                      const totalStock = productDetalles.reduce((sum:number, detalle:IDetalle) => sum + (detalle.stock || 0), 0);
                      const precios = productDetalles.map(d => d.precio?.precioVenta).filter(Boolean);
                      const minPrecio = precios.length > 0 ? Math.min(...precios as number[]) : 0;
                      const maxPrecio = precios.length > 0 ? Math.max(...precios as number[]) : 0;
                      const isExpanded = expandedProducts.has(producto.id!);
                      
                      return (
                        <React.Fragment key={producto.id}>
                          {/* Fila principal del producto */}
                          <tr className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleProductExpansion(producto.id!)}
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
                                <div className="break-words font-medium">{producto.nombre}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <div className="break-words">{producto.categoria?.nombre || "Sin categoría"}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {productDetalles.length} opciones
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <span className="font-medium">{totalStock}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {precios.length > 0 ? (
                                minPrecio === maxPrecio ? 
                                  `${minPrecio}` : 
                                  `${minPrecio} - ${maxPrecio}`
                              ) : 'Sin precios'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              <button
                                onClick={() => toggleProductExpansion(producto.id!)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {isExpanded ? 'Ocultar' : 'Ver detalles'}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Filas expandidas con los detalles */}
                          {isExpanded && productDetalles.map((detalle: IDetalle) => (
                            <tr key={`detalle-${detalle.id}`} className="bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-600 pl-12">
                                <span className="text-xs text-gray-500">Detalle #{detalle.id}</span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-flex px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                                    {detalle.talle?.talle || "S/T"}
                                  </span>
                                  <span className="inline-flex px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">
                                    {detalle.color?.color || "S/C"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                Stock: <span className="font-medium">{detalle.stock ?? 0}</span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  detalle.activo ? 'bg-green-100 text-green-800' : 
                                  'bg-red-100 text-red-800'}
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {detalle.activo ? "Disponible" : "No disponible"}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                <div className="text-xs">
                                  <div>Venta: <span className="font-medium">${detalle.precio?.precioVenta || "N/A"}</span></div>
                                  <div>Compra: <span className="font-medium">${detalle.precio?.precioCompra || "N/A"}</span></div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                <div className="flex space-x-2">
                                  <button className="text-green-600 hover:text-green-800 text-xs"
                                  onClick={() => handleOpenModalEditDetalle(detalle)}>
                                    Editar
                                  </button>
                                  <button className="text-red-600 hover:text-red-800 text-xs"
                                  onClick={() => handleEliminarDetalle(detalle.id)}>
                                    Eliminar
                                  </button>
                                  {!detalle.activo && <button
                          title="Restaurar"
                          onClick={() => handleRestoreDetalle(detalle.id!, true)}
                          className="p-1.5 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-lg transition-all duration-200"
                        >
                          <GiAngelOutfit size={16}/>
                        </button>}
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
        )}
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
                            {!categoria.activo && <button
                          title="Restaurar"
                          onClick={() => handleRestoreCategoria(categoria.id!, true)}
                          className="p-1.5 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-lg transition-all duration-200"
                        >
                          <GiAngelOutfit size={16}/>
                        </button>}
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
                            {!color.activo && <button
                          title="Restaurar"
                          onClick={() => handleRestoreColor(color.id!, true)}
                          className="p-1.5 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-lg transition-all duration-200"
                        >
                          <GiAngelOutfit size={16}/>
                        </button>}
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
                            {!precio?.activo && <button
                                                      title="Restaurar"
                                                      onClick={() => handleRestorePrecio(precio.id!, true)}
                                                      className="p-1.5 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-lg transition-all duration-200"
                                                    >
                                                      <GiAngelOutfit size={16}/>
                                                    </button>}
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
      {openModal && activeModalType === 'detalle' && (
        <DetalleModal 
          activeDetalle={detalleActivo} 
          openModalSee={openModalSee} 
          handleCloseModal={handleCloseModal} 
        />
      )}
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