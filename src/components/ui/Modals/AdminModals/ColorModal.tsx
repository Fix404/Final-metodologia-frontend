import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IColor } from "../../../../types/IColor";
import { colorService } from "../../../../services/colorService";

interface IModalProps {
  activeColor: IColor | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: IColor = {
  id: null,
  color: '',
  activo: true
};

export const ColorModal = ({
  activeColor,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IColor>(initialState);
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
      
      if (activeColor?.id) {
        const result = await colorService.actualizarColor(activeColor.id, formValues);
        console.log('Color actualizado:', result);
      } else {
        const result = await colorService.crearColor(formValues);
        console.log('Color creado:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar el Color');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeColor ?? initialState);
    setError(null);
  }, [activeColor]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Color' : activeColor?.id ? 'Editar Color' : 'Crear Color'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="color">
              Color <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 border border-gray-300 rounded"
                  style={{ backgroundColor: formValues.color }}
                ></div>
                <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded flex-1">
                  {formValues.color || '—'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formValues.color || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                  required
                  disabled={loading}
                  placeholder="Ingrese el color (ej: #FF0000 o rojo)"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Estado
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                {formValues.activo ? 'Activo' : 'Inactivo'}
              </p>
            ) : (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formValues.activo || false}
                  onChange={handleChange}
                  className="mr-2"
                  disabled={loading}
                />
                <label htmlFor="activo" className="text-sm">
                  Activo
                </label>
              </div>
            )}
          </div>

          {(openModalSee || activeColor?.id) && (
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
                {loading ? 'Guardando...' : activeColor?.id ? 'Actualizar' : 'Crear'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};