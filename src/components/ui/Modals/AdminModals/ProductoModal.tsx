import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IProducto } from "../../../../types/IProducto";
import { productoService } from "../../../../services/productoService";
import { ICategoria } from "../../../../types/ICategoria";
import { IDescuento } from "../../../../types/IDescuento";
import { IImagen } from "../../../../types/IImagen";
import { categoriaService } from "../../../../services/categoriaService";
import { descuentoService } from "../../../../services/descuentoService";
import { imagenService } from "../../../../services/imagenService";

// Interfaces 

interface IModalProps {
  activeProduct: IProducto | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: IProducto = {
  id: null,
  nombre: '',
  descripcion:'',
  categoria: null,
  tipo: null,
  sexoProducto: null,
  descuento: null,
  imagen: null,
  activo: true
};

export const ProductoModal = ({
  activeProduct,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IProducto>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tiposProducto = ['CALZADO', 'ROPA'];
  const sexosProducto = ['MUJER', 'HOMBRE', 'UNISEX'];
  
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [descuentos, setDescuentos] = useState<IDescuento[]>([]);
  const [imagenes, setImagenes] = useState<IImagen[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const cargarOpciones = async () => {
    setLoadingOptions(true);
    try {
      
         const categoriasRes=await categoriaService.obtenerCategoriasActivos()
         const descuentosRes=await descuentoService.obtenerDescuentosActivos() 
         const imagenesRes=await imagenService.obtenerImagenesActivos()
      
      setCategorias(categoriasRes);
      setDescuentos(descuentosRes);
      setImagenes(imagenesRes);
    } catch (err) {
      console.error('Error al cargar opciones:', err);
      setError('Error al cargar las opciones');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'categoria') {
      const categoria = categorias.find(cat => cat.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, categoria }));
    } else if (name === 'descuento') {
      const descuento = descuentos.find(desc => desc.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, descuento }));
    } else if (name === 'imagen') {
      const imagen = imagenes.find(img => img.id === parseInt(value)) || null;
      setFormValues(prev => ({ ...prev, imagen }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando datos:', formValues);
      
      if (activeProduct?.id) {
        const result = await productoService.actualizarProducto(activeProduct.id, formValues);
        console.log('Producto actualizado:', result);
      } else {
        const result = await productoService.crearProducto(formValues);
        console.log('Producto creado:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar el Producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeProduct ?? initialState);
    setError(null);
  }, [activeProduct]);

  useEffect(() => {
    cargarOpciones();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Producto' : activeProduct?.id ? 'Editar Producto' : 'Crear Producto'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        {loadingOptions && <p className="text-blue-500 mb-4 text-sm text-center">Cargando opciones...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'nombre', label: 'Nombre', type: "text", required: true },
            { name: 'descripcion', label: 'Descripción', type: "text", required: false },
          ].map(({ name, label, type, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1" htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {openModalSee ? (
                <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                  {formValues[name as keyof IProducto]?.toString() || '—'}
                </p>
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formValues[name as keyof IProducto]?.toString() || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                  required={required}
                  disabled={loading}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="tipo">
              Tipo <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.tipo || '—'}
              </p>
            ) : (
              <select
                id="tipo"
                name="tipo"
                value={formValues.tipo || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading}
              >
                <option value="">Seleccionar tipo</option>
                {tiposProducto.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sexoProducto">
              Sexo <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.sexoProducto || '—'}
              </p>
            ) : (
              <select
                id="sexoProducto"
                name="sexoProducto"
                value={formValues.sexoProducto || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading}
              >
                <option value="">Seleccionar sexo</option>
                {sexosProducto.map(sexo => (
                  <option key={sexo} value={sexo}>
                    {sexo}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="categoria">
              Categoría <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.categoria?.nombre || '—'}
              </p>
            ) : (
              <select
                id="categoria"
                name="categoria"
                value={formValues.categoria?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading || loadingOptions}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="descuento">
              Descuento
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.descuento?.porcentaje}
              </p>
            ) : (
              <select
                id="descuento"
                name="descuento"
                value={formValues.descuento?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading || loadingOptions}
              >
                <option value="">Sin descuento</option>
                {descuentos.map(descuento => (
                  <option key={descuento.id} value={descuento.id}>
                    {`${descuento.porcentaje}%`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="imagen">
              Imagen
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.imagen?.altDescripcion || '—'}
              </p>
            ) : (
              <select
                id="imagen"
                name="imagen"
                value={formValues.imagen?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading || loadingOptions}
              >
                <option value="">Sin imagen</option>
                {imagenes.map(imagen => (
                  <option key={imagen.id} value={imagen.id}>
                    {imagen.altDescripcion}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
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
                {loading ? 'Guardando...' : activeProduct?.id ? 'Actualizar' : 'Crear'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};