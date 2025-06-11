import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICategoria } from "../../../../types/ICategoria";
import { categoriaService } from "../../../../services/categoriaService";

interface IModalProps {
  activeCategoria: ICategoria | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: ICategoria = {
  id: null,
  nombre: '',
  activo: true
};

export const CategoriaModal = ({
  activeCategoria,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<ICategoria>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormValues(prev => ({ ...prev, [name]: checked }));
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
      
      if (activeCategoria?.id) {
        const result = await categoriaService.actualizarCategoria(activeCategoria.id, formValues);
        console.log('Categoría actualizada:', result);
      } else {
        const result = await categoriaService.crearCategoria(formValues);
        console.log('Categoría creada:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar la Categoría');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeCategoria ?? initialState);
    setError(null);
  }, [activeCategoria]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Categoría' : activeCategoria?.id ? 'Editar Categoría' : 'Crear Categoría'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.nombre || '—'}
              </p>
            ) : (
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formValues.nombre || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading}
                placeholder="Ingrese el nombre de la categoría"
              />
            )}
          </div>

          {/* Mostrar ID solo en modo ver o editar */}
          {(openModalSee || activeCategoria?.id) && (
            <div>
              <label className="block text-sm font-medium mb-1">
                ID
              </label>
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.id || '—'}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={handleCloseModal}
              disabled={loading}
            >
              {openModalSee ? 'Cerrar' : 'Cancelar'}
            </button>
            {!openModalSee && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Guardando...' : activeCategoria?.id ? 'Actualizar' : 'Crear'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};