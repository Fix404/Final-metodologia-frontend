import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IPrecio } from "../../../../types/IPrecio";
import { precioService } from "../../../../services/precioService";

interface IModalProps {
  activePrecio: IPrecio | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: IPrecio = {
  id: 0,
  precioCompra: 0,
  precioVenta: 0,
  activo: true
};

export const PrecioModal = ({
  activePrecio,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IPrecio>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormValues(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numericValue = parseFloat(value) || 0;
      setFormValues(prev => ({ ...prev, [name]: numericValue }));
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
      
      if (activePrecio?.id) {
        const result = await precioService.actualizarPrecio(activePrecio.id, formValues);
        console.log('Precio actualizado:', result);
      } else {
        const result = await precioService.crearPrecio(formValues);
        console.log('Precio creado:', result);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar el Precio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activePrecio ?? initialState);
    setError(null);
  }, [activePrecio]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Precio' : activePrecio?.id ? 'Editar Precio' : 'Crear Precio'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Precio de Compra */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="precioCompra">
              Precio de Compra <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                ${formValues.precioCompra?.toFixed(2) || '0.00'}
              </p>
            ) : (
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                value={formValues.precioCompra || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            )}
          </div>

          {/* Campo Precio de Venta */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="precioVenta">
              Precio de Venta <span className="text-red-500">*</span>
            </label>
            {openModalSee ? (
              <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                ${formValues.precioVenta?.toFixed(2) || '0.00'}
              </p>
            ) : (
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                value={formValues.precioVenta || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required
                disabled={loading}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            )}
          </div>

          {/* Campo Estado Activo */}
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

          {/* Mostrar ID solo en modo ver o editar */}
          {(openModalSee || activePrecio?.id) && (
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
                {loading ? 'Guardando...' : activePrecio?.id ? 'Actualizar' : 'Crear'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};