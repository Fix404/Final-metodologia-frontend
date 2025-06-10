import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IProducto } from "../../../../types/IProducto";
import { productoService } from "../../../../services/productoService";

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
  disponible: true
};

export const ProductoModal = ({
  activeProduct,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IProducto>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value, // Removido la lógica específica de 'dni' que no aplica para productos
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando datos:', formValues); // Para debug
      
      if (activeProduct?.id) {
        const result = await productoService.actualizarProducto(activeProduct.id, formValues);
        console.log('Producto actualizado:', result);
      } else {
        const result = await productoService.crearProducto(formValues);
        console.log('Producto creado:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err); // Para debug
      setError(err.response?.data?.message || 'Error al guardar el Producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeProduct ?? initialState);
    setError(null);
  }, [activeProduct]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Producto' : activeProduct?.id ? 'Editar Producto' : 'Crear Producto'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'nombre', label: 'Nombre', type: "text" },
            { name: 'descripcion', label: 'Descripción', type: "text" },
            // { name: 'categoria', label: 'Categoría', type: "text" },
            { name: 'tipo', label: 'Tipo', type: "text" },
            { name: 'sexoProducto', label: 'Sexo', type: "text" },
            // { name: 'descuento', label: 'Descuento', type: "number" },
            // { name: 'imagen', label: 'Imagen', type: "text" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              {openModalSee ? (
                <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                  {formValues[name as keyof IProducto] == null
                    ? '—'
                    : typeof formValues[name as keyof IProducto] === 'object'
                    ? JSON.stringify(formValues[name as keyof IProducto])
                    : formValues[name as keyof IProducto]!.toString()}
                </p>
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formValues[name as keyof IProducto]?.toString() || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                  required={['nombre', 'categoria', 'tipo', "sexoProducto"].includes(name)}
                  disabled={loading}
                />
              )}
            </div>
          ))}

          {/* Campo para disponible */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <input
                type="checkbox"
                name="disponible"
                checked={formValues.disponible}
                onChange={(e) => setFormValues(prev => ({ ...prev, disponible: e.target.checked }))}
                disabled={openModalSee || loading}
                className="mr-2"
              />
              Disponible
            </label>
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
                disabled={loading}
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