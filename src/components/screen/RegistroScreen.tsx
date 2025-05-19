import { Link, useNavigate } from 'react-router-dom';
import { RegistroForm } from '../forms/RegistroForm';

export const RegistroScreen = () => {
  const navigate = useNavigate();

  // Función que se ejecuta cuando el formulario se envía con éxito
  const handleSuccess = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center bg-[#f0f4f9] px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#27548a] px-6 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Crear Cuenta
            </h2>
          </div>
          <div className="px-6 py-4">
            <RegistroForm onSuccess={handleSuccess} />
          </div>

          <div className="mt-2 mb-4 text-center">
            <p className="text-sm text-gray-600"></p>
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-[#27548a] hover:text-[#1e3e66] transition-colors"
            >
              Iniciá sesión
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
