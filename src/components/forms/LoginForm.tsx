import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { loginSchema } from './schema/loginSchema';
import { login } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch} from '../../hooks/redux';
import { setRoles, setUsuario } from '../../redux/slices/authSlice';
import { logout } from '../../redux/slices/authSlice'


interface DecodedToken {
  id: number,
  rol: string[];
  sub: string;
  exp: number;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);


  const formik = useFormik({
    initialValues: {
      email: '',
      contrasenia: '',
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError(null);

      try {
        const data = await login(values.email, values.contrasenia);


        const decodedToken = jwtDecode<DecodedToken>(data.token);
        console.log("DECODED TOKEN", decodedToken);
        console.log("id correspondiente: ", decodedToken.id);

        const usuarioFromToken = {
          email: decodedToken.sub,
          id: decodedToken.id, 
        };

        dispatch(setRoles(decodedToken.rol));
        dispatch(setUsuario(usuarioFromToken));
        console.log("USUARIO:", usuarioFromToken)

        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setServerError('Sesión expirada. Por favor, iniciá sesión nuevamente.');
          localStorage.removeItem('authToken');
          dispatch(logout())
          return;
        }

        if (decodedToken.rol && decodedToken.rol.includes('CLIENTE')) {
          navigate('/');
        } else {
          navigate('/admin');
        }

      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          setServerError('Credenciales incorrectas.');
        } else {
          setServerError('No estás registrado.');
        }
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

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
          Usuario
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block w-full py-2 border ${formik.touched.email && formik.errors.email
            ? 'border-red-500'
            : 'border-gray-300'
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-3`}
          placeholder="Ingresá tu correo electrónico"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="contrasenia"
            name="contrasenia"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.contrasenia}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full py-2 pl-3 border ${formik.touched.contrasenia && formik.errors.contrasenia
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
        {formik.touched.contrasenia && formik.errors.contrasenia && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.contrasenia}</p>
        )}
      </div>

      <div className='mt-10'>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#27548A] hover:bg-[#1e3e66] ${isLoading || !formik.isValid ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};
