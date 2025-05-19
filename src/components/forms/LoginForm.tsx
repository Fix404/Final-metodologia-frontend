import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { loginSchema } from './schema/loginSchema';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Datos de login enviados:', values);
        navigate('/');
      } catch (error) {
        console.error(error);
        setServerError('Credenciales incorrectas. Por favor intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form className="mt-4 space-y-6" onSubmit={formik.handleSubmit}>
      {serverError && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{serverError}</div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-lg font-medium text-gray-700 mb-2">
          Usuario
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block w-full py-2 border ${
            formik.touched.nombre && formik.errors.nombre
              ? 'border-red-500'
              : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-3`}
          placeholder="Ingresá tu nombre"
        />
        {formik.touched.nombre && formik.errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.nombre}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full py-2 pl-3 border ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
        )}
      </div>

      <div className='mt-10'>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
            isLoading || !formik.isValid ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};
