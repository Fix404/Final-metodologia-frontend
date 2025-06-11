import { Link, useNavigate } from 'react-router-dom';
import { EditarDatosForm } from '../forms/EditarDatosForm';
import Swal from 'sweetalert2';

export const EditarUsuarioScreen = () => {
  const navigate = useNavigate();

const handleSuccess = () => {
  Swal.fire({
    icon: 'success',
    title: 'Usuario actualizado con éxito',
    showConfirmButton: false,
    timer: 2000
  });

  setTimeout(() => {
    navigate('/productos');
  }, 2000); 
};


  const handleCancel = () => {
    navigate('/');
  };

  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center bg-[#fcfcd3] px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#27548a] px-6 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Editar Datos
            </h2>
          </div>
          <div className="px-6 py-4">
            <EditarDatosForm 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>

          <div className="mt-2 mb-4 text-center">
            <p className="text-sm text-gray-600">
              <Link
                to="/cambiar-contrasenia"
                className="font-medium text-[#27548a] hover:text-[#1e3e66] transition-colors"
              >
                Cambiar contraseña
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};