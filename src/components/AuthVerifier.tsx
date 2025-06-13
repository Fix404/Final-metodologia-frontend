import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { vaciarCarrito } from '../redux/slices/CarritoSlice';


interface TokenPayload {
  exp: number;
  [key: string]: any;
}

const AuthVerifier: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => !!state.auth.usuario);

  useEffect(() => {
    if (!isAuthenticated) return; 

    const token = localStorage.getItem('authToken');
    if (!token) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    try {
      const payload: TokenPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        dispatch(logout());
        dispatch(vaciarCarrito())
        localStorage.removeItem('authToken');
        navigate('/login');
        toast.info("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
      } else {
        const expiresInMs = (payload.exp * 1000) - Date.now();

        timeoutId = setTimeout(() => {
          alert('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
          dispatch(logout());
          localStorage.removeItem('authToken');
          dispatch(vaciarCarrito())
          navigate('/login');
        }, expiresInMs);
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      dispatch(logout());
      localStorage.removeItem('authToken');
      dispatch(vaciarCarrito())
      navigate('/login');
      toast.error("Error con la sesión. Por favor, vuelve a iniciar sesión.");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId); 
    };
  }, [dispatch, navigate, isAuthenticated]);

  return null;
};

export default AuthVerifier;
