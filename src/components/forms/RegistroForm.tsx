import { useFormik } from 'formik';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { registroSchema } from '../forms/schema/registroSchema';

interface RegistroFormProps {
  onSuccess: () => void;
}

export const RegistroForm = ({ onSuccess }: RegistroFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registroSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError(null);

      try {
        // Simulamos llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Datos de registro enviados:', values);

        // Llamada real a API aquí

        onSuccess(); // Avisamos que fue exitoso para que el contenedor actúe
      } catch (error) {
        console.error('Error de registro:', error);
        setServerError('No se pudo completar el registro. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      {serverError && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
          {serverError}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${
                formik.touched.name && formik.errors.name
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Tu nombre completo"
            />
          </div>
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="tu@ejemplo.com"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-500" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`pl-10 block w-full py-2 border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-500" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading || !formik.isValid ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Registrarse'
            )}
          </button>
        </div>
      </form>
    </>
  );
};
