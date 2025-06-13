import { useFormik } from 'formik';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { passwordSchema } from './schema/passwordSchema';
import { useState } from 'react';


export const PasswordForm = ({ onSubmit, serverError, isLoading, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      contraseniaActual: '',
      contraseniaNueva: '',
      confirmarContrasenia: '',
    },
    validationSchema: passwordSchema,
    onSubmit,
  });

  return (
    <>
      {serverError && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
          {serverError}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        {/* Contraseña Actual */}
        <div>
          <label htmlFor="contraseniaActual" className="block text-sm font-medium text-gray-700">
            Contraseña Actual
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="contraseniaActual"
              name="contraseniaActual"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formik.values.contraseniaActual}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${formik.touched.contraseniaActual && formik.errors.contraseniaActual
                  ? 'border-red-500'
                  : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Ingresa tu contraseña actual"
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
          {formik.touched.contraseniaActual && formik.errors.contraseniaActual && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.contraseniaActual}</p>
          )}
        </div>

        {/* Contraseña Nueva */}
        <div>
          <label htmlFor="contraseniaNueva" className="block text-sm font-medium text-gray-700">
            Contraseña Nueva
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="contraseniaNueva"
              name="contraseniaNueva"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formik.values.contraseniaNueva}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${formik.touched.contraseniaNueva && formik.errors.contraseniaNueva
                  ? 'border-red-500'
                  : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Ingresa tu nueva contraseña"
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
          {formik.touched.contraseniaNueva && formik.errors.contraseniaNueva && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.contraseniaNueva}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmarContrasenia" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="confirmarContrasenia"
              name="confirmarContrasenia"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formik.values.confirmarContrasenia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${formik.touched.confirmarContrasenia && formik.errors.confirmarContrasenia
                  ? 'border-red-500'
                  : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Confirma tu nueva contraseña"
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
          {formik.touched.confirmarContrasenia && formik.errors.confirmarContrasenia && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmarContrasenia}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className="flex-1 bg-[#27548a] text-white py-2 px-4 rounded-md hover:bg-[#1e3e66] focus:outline-none focus:ring-2 focus:ring-[#27548a] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
};
