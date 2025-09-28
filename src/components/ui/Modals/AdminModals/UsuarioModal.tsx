import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IUsuario } from '../../../../types/IUsuario';
import { usuariosService } from '../../../../services/usuarioService';
import { CreateUsuarioDireccion } from '../../../forms/CreateUsuarioDireccion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
  //direccion: null,
  dni: null,
  rol: 'ADMIN',
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
  //const [direccionEnvio, setDireccionEnvio] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

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
      if (!formValues.nombre) throw new Error("Debe ingresar un nombre");
      if (!formValues.apellido) throw new Error("Debe ingresar un apellido");
      if (!formValues.contrasenia && !activeUser?.id) throw new Error("Debe ingresar una contraseña");
      if (!formValues.email) throw new Error("Debe ingresar un email");
      if (!formValues.dni) throw new Error("Debe ingresar un dni");

      // const dto: ICreateUsuarioDTO = {
      //   nombre: formValues.nombre,
      //   apellido: formValues.apellido,
      //   email: formValues.email,
      //   contrasenia: formValues.contrasenia,
      //   dni: formValues.dni,
      //   rol: "USUARIO",
      //   activo: formValues.activo,
      //   direccion: direccionEnvio
      //     ? {
      //         calle: direccionEnvio.calle,
      //         numero: Number(direccionEnvio.numero),
      //         provincia: direccionEnvio.provincia,
      //         idLocalidad: direccionEnvio.localidad.id,
      //       }
      //     : null,
      // };

      if (activeUser?.id) {
        await usuariosService.actualizarUsuario(activeUser.id, formValues);
      } else {
        await usuariosService.crearUsuario(formValues);
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const limpiarError = () => {
    setError(null);
  };

  useEffect(() => {
    setFormValues(activeUser ?? initialState);
    //setDireccionEnvio(activeUser?.direccion || null);
    setError(null);
  }, [activeUser]);

  /* CORRECCIÓN: Esta es la función que faltaba
  const handleDireccionChange = (nuevaDireccion: any) => {
    setDireccionEnvio(nuevaDireccion);
    console.log('Dirección actualizada:', nuevaDireccion);
  };*/

  /*const renderDireccionSection = () => {
    if (openModalSee) {
      return (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Dirección
          </label>
          <div className="px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg">
            {formValues.direccion ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-800 font-medium">
                  {formValues.direccion.calle} {formValues.direccion.numero}
                </p>
                <p className="text-sm text-gray-600">
                  {formValues.direccion.localidad.localidad}, {formValues.direccion.provincia}
                </p>
                {formValues.direccion.codigoPostal && (
                  <p className="text-sm text-gray-600">
                    CP: {formValues.direccion.codigoPostal}
                  </p>
                )}
              </div>
            ) : (
              <span className="text-gray-500 italic">Sin dirección registrada</span>
            )}
          </div>
        </div>
      );
    }*/

    /*CORRECCIÓN: Pasamos las props correctas
    return (
     /* <CreateUsuarioDireccion
        usuario={formValues}
        compraDireccionEnvio={direccionEnvio}
        onDireccionChange={handleDireccionChange}
        loading={loading}
      />
    );
  };*/

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
          {openModalSee ? 'Ver Usuario' : activeUser ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 mr-3">⚠️</span>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={limpiarError}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos básicos del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'nombre', label: 'Nombre', required: true },
              { name: 'apellido', label: 'Apellido' },
              { name: 'dni', label: 'DNI', type: 'number' },
              { name: 'email', label: 'Email', type: 'email', required: true },
            ].map(({ name, label, type = 'text', required = false }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor={name}>
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {openModalSee ? (
                  <p className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required={required}
                    disabled={loading}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Sección de dirección */}
          {/*renderDireccionSection()*/}

          {/* Campo de contraseña (solo para crear/editar) */}
          {/*!openModalSee && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="contrasenia">
                Contraseña {!activeUser?.id && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasenia"
                name="contrasenia"
                value={formValues.contrasenia || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                required={!activeUser?.id}
                disabled={loading}
                placeholder={activeUser?.id ? 'Dejar en blanco para mantener actual' : ''}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEye className="text-gray-400 hover:text-gray-500" />
                ) : (
                  <FiEyeOff className="text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
            </div>
          )*/}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              onClick={handleCloseModal}
              disabled={loading}
            >
              {openModalSee ? 'Cerrar' : 'Cancelar'}
            </button>
            {!openModalSee && (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Usuario'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )};
