import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IUsuario } from '../../../../types/IUsuario';
import { usuariosService } from '../../../../services/usuarioService';

interface IModalProps {
  activeUser: IUsuario | null;
  openModalSee: boolean;
  handleCloseModal: () => void;
}

const initialState: IUsuario = {
  id: null,
  nombre: '',
  apellido: null,
  email: '',
  contrasenia: '',
  direccion: null,
  dni: null,
  rol: 'ADMIN',
  activo: true
};

const initialDireccionState = {
  id: 0,
  calle: '',
  numero: '',
  codigoPostal: '',
  localidad: {
    id: 0,
    localidad: '',
    codigo_postal: 0,
  },
  provincia: '',
};

export const UsuarioModal = ({
  activeUser,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IUsuario>(initialState);
  const [direccionForm, setDireccionForm] = useState(initialDireccionState);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'dni' ? parseInt(value) || null : value,
    }));
  };

  const handleDireccionChange = (field: string, value: string) => {
    if (field === 'localidad') {
      setDireccionForm(prev => ({
        ...prev,
        localidad: {
          ...prev.localidad,
          localidad: value,
        }
      }));
    } else if (field === 'codigoPostal') {
      const numericValue = parseInt(value) || 0;
      setDireccionForm(prev => ({
        ...prev,
        codigoPostal: value,
        localidad: {
          ...prev.localidad,
          codigo_postal: numericValue,
        }
      }));
    } else {
      setDireccionForm(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleGuardarDireccion = () => {
    if (
      direccionForm.calle.trim() &&
      direccionForm.numero.trim() &&
      direccionForm.codigoPostal.trim() &&
      direccionForm.localidad.localidad.trim() &&
      direccionForm.provincia.trim() &&
      direccionForm.localidad.codigo_postal > 0
    ) {
      setFormValues(prev => ({
        ...prev,
        direccion: direccionForm
      }));
      setMostrarFormularioDireccion(false);
    } else {
      alert('Todos los campos de dirección son obligatorios.');
    }
  };

  const handleEliminarDireccion = () => {
    setFormValues(prev => ({
      ...prev,
      direccion: null
    }));
    setDireccionForm(initialDireccionState);
  };

  const handleEditarDireccion = () => {
    if (formValues.direccion) {
      setDireccionForm(formValues.direccion);
    }
    setMostrarFormularioDireccion(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeUser?.id) {
        await usuariosService.actualizarUsuario(activeUser.id, formValues);
      } else {
        await usuariosService.crearUsuario(formValues);
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormValues(activeUser ?? initialState);
    if (activeUser?.direccion) {
      setDireccionForm(activeUser.direccion);
    } else {
      setDireccionForm(initialDireccionState);
    }
    setMostrarFormularioDireccion(false);
    setError(null);
  }, [activeUser]);

  const renderDireccionSection = () => {
    if (openModalSee) {
      return (
        <div>
          <label className="block text-sm font-medium mb-1">
            Dirección
          </label>
          <div className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
            {formValues.direccion ? (
              <div>
                <p>{formValues.direccion.calle} {formValues.direccion.numero}</p>
                <p>{formValues.direccion.localidad.localidad}, {formValues.direccion.provincia}</p>
                {formValues.direccion.codigoPostal && <p>CP: {formValues.direccion.codigoPostal}</p>}
              </div>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium mb-1">
          Dirección
        </label>
        
        {formValues.direccion && !mostrarFormularioDireccion ? (
          <div className="border border-gray-300 rounded p-3 bg-gray-50">
            <div className="mb-2">
              <p className="text-sm text-gray-700">
                {formValues.direccion.calle} {formValues.direccion.numero}
              </p>
              <p className="text-sm text-gray-700">
                {formValues.direccion.localidad.localidad}, {formValues.direccion.provincia}
              </p>
              {formValues.direccion.codigoPostal && (
                <p className="text-sm text-gray-700">CP: {formValues.direccion.codigoPostal}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleEditarDireccion}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={loading}
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleEliminarDireccion}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={loading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : mostrarFormularioDireccion ? (
          <div className="border border-gray-300 rounded p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Calle *"
                value={direccionForm.calle}
                onChange={(e) => handleDireccionChange('calle', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Número *"
                value={direccionForm.numero}
                onChange={(e) => handleDireccionChange('numero', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Código Postal *"
                value={direccionForm.codigoPostal}
                onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Provincia *"
                value={direccionForm.provincia}
                onChange={(e) => handleDireccionChange('provincia', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Localidad *"
                value={direccionForm.localidad.localidad}
                onChange={(e) => handleDireccionChange('localidad', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring col-span-2"
                disabled={loading}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleGuardarDireccion}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                disabled={loading}
              >
                Confirmar Dirección
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormularioDireccion(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMostrarFormularioDireccion(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring text-left"
            disabled={loading}
          >
            + Agregar dirección
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          {openModalSee ? 'Ver Usuario' : activeUser ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'nombre', label: 'Nombre' },
            { name: 'apellido', label: 'Apellido' },
            { name: 'dni', label: 'DNI' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map(({ name, label, type = 'text' }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1" htmlFor={name}>
                {label}
              </label>
              {openModalSee ? (
                <p className="px-3 py-2 border border-gray-200 bg-gray-100 rounded">
                  {formValues[name as keyof IUsuario] == null
                    ? '—'
                    : typeof formValues[name as keyof IUsuario] === 'object'
                    ? JSON.stringify(formValues[name as keyof IUsuario])
                    : formValues[name as keyof IUsuario]!.toString()}
                </p>
              ) : (
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formValues[name as keyof IUsuario]?.toString() || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                  required={['nombre', 'email', 'contrasenia'].includes(name)}
                  disabled={loading}
                />
              )}
            </div>
          ))}

          {renderDireccionSection()}

          {!openModalSee && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="contrasenia">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasenia"
                name="contrasenia"
                value={formValues.contrasenia || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
                required={!activeUser?.id}
                disabled={loading}
              />
            </div>
          )}

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
                {loading ? 'Guardando...' : 'Aceptar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};