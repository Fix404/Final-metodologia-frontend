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
  rol: '',
  activo: true
};

export const UsuarioModal = ({
  activeUser,
  openModalSee,
  handleCloseModal,
}: IModalProps) => {
  const [formValues, setFormValues] = useState<IUsuario>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'dni' ? parseInt(value) || null : value,
    }));
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
    setError(null);
  }, [activeUser]);

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
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'contrasenia', label: 'Contraseña', type: 'password' },
            { name: 'dni', label: 'DNI' },
            { name: 'rol', label: 'Rol' },
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
