import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IDetalle } from "../../../../types/IDetalle";
import { detalleService } from "../../../../services/detalleService";
import { IProducto } from "../../../../types/IProducto";
import { ITalle } from "../../../../types/ITalle";
import { IColor } from "../../../../types/IColor";
import { IPrecio } from "../../../../types/IPrecio";
import { Estado } from "../../../../types/enums/Estado";
import { productoService } from "../../../../services/productoService";
import { talleService } from "../../../../services/talleService";
import { colorService } from "../../../../services/colorService";
import { precioService } from "../../../../services/precioService";

// Interfaces 

interface IModalProps {
  activeDetalle: IDetalle | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: IDetalle = {
  id: null,
  talle: null,
  color: null,
  precio: null,
  stock: 0,
  estado: Estado.DISPONIBLE,
  producto: null
};

export const DetalleModal = ({
  activeDetalle,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IDetalle>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const estadosDetalle = [Estado.DISPONIBLE, Estado.NO_DISPONIBLE];
  
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [talles, setTalles] = useState<ITalle[]>([]);
  const [colores, setColores] = useState<IColor[]>([]);
  const [precios, setPrecios] = useState<IPrecio[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const cargarOpciones = async () => {
    setLoadingOptions(true);
    try {
      
         const productosRes = await productoService.obtenerProductosActivos()
         const tallesRes = await talleService.obtenerTallesActivos() 
         const coloresRes = await colorService.obtenerColoresActivos()
         const preciosRes = await precioService.obtenerPreciosActivos()
      
      setProductos(productosRes);
      setTalles(tallesRes);
      setColores(coloresRes);
      setPrecios(preciosRes);
    } catch (err) {
      console.error('Error al cargar opciones:', err);
      setError('Error al cargar las opciones');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'producto') {
      const producto = productos.find(prod => prod.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, producto }));
    } else if (name === 'talle') {
      const talle = talles.find(t => t.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, talle }));
    } else if (name === 'color') {
      const color = colores.find(c => c.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, color }));
    } else if (name === 'precioCompra' || name === 'precioVenta') {
      const precio = precios.find(p => p.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, precio }));
    } else if (name === 'stock') {
      setFormValues(prev => ({ ...prev, stock: parseInt(value) || 0 }));
    } else if (name === 'estado') {
      setFormValues(prev => ({ ...prev, estado: value as Estado }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar los datos para enviar - solo IDs de las entidades relacionadas
      const dataToSend = {
        ...formValues,
        talleId: formValues.talle?.id,
        colorId: formValues.color?.id,
        precioId: formValues.precio?.id,
        productoId: formValues.producto?.id,
        // Remover las entidades completas para evitar problemas de serialización
        talle: undefined,
        color: undefined,
        precio: undefined,
        producto: undefined
      };

      console.log('Enviando datos:', dataToSend);
      
      if (activeDetalle?.id) {
        const result = await detalleService.actualizarDetalle(activeDetalle.id, dataToSend);
        console.log('Detalle actualizado:', result);
      } else {
        const result = await detalleService.crearDetalle(dataToSend);
        console.log('Detalle creado:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar el Detalle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeDetalle ?? initialState);
    setError(null);
  }, [activeDetalle]);

  useEffect(() => {
    cargarOpciones();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Detalle' : activeDetalle?.id ? 'Editar Detalle' : 'Crear Detalle'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        {loadingOptions && <p className="text-blue-500 mb-4 text-sm text-center">Cargando opciones...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Producto - Movido al primer lugar */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="producto">
              Producto <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.producto?.nombre || '—'}
              </p>
            ) : (
              <select
                id="producto"
                name="producto"
                value={formValues.producto?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="stock">
              Stock
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.stock?.toString() || '—'}
              </p>
            ) : (
              <input
                type="number"
                id="stock"
                name="stock"
                value={formValues.stock?.toString() || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
                min="0"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="estado">
              Estado
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.estado || '—'}
              </p>
            ) : (
              <select
                id="estado"
                name="estado"
                value={formValues.estado || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
              >
                <option value="">Seleccionar estado</option>
                {estadosDetalle.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Precio de Compra - Campo separado */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="precioCompra">
              Precio de compra <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.precio?.precioCompra ? `$${formValues.precio.precioCompra}` : '—'}
              </p>
            ) : (
              <select
                id="precioCompra"
                name="precioCompra"
                value={formValues.precio?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar precio de compra</option>
                {precios.map(precio => (
                  <option key={precio.id} value={precio.id}>
                    ${precio.precioCompra}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Precio de Venta - Campo separado nuevo */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="precioVenta">
              Precio de venta <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.precio?.precioVenta ? `$${formValues.precio.precioVenta}` : '—'}
              </p>
            ) : (
              <select
                id="precioVenta"
                name="precioVenta"
                value={formValues.precio?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar precio de venta</option>
                {precios.map(precio => (
                  <option key={precio.id} value={precio.id}>
                    ${precio.precioVenta}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="talle">
              Talle <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.talle?.talle || '—'}
              </p>
            ) : (
              <select
                id="talle"
                name="talle"
                value={formValues.talle?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar talle</option>
                {talles.map(talle => (
                  <option key={talle.id} value={talle.id}>
                    {talle.talle}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="color">
              Color <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.color?.color || '—'}
              </p>
            ) : (
              <select
                id="color"
                name="color"
                value={formValues.color?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar color</option>
                {colores.map(color => (
                  <option key={color.id} value={color.id}>
                    {color.color}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={handleCloseModal}
              disabled={loading}
            >
              {openModalSee ? 'Cerrar' : 'Cancelar'}
            </button>
            {!openModalSee && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading || loadingOptions}
              >
                {loading ? 'Guardando...' : activeDetalle?.id ? 'Actualizar' : 'Crear'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};