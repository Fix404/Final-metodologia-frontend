import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { PasswordForm } from '../forms/passwordForm';
import { useAppSelector } from '../../hooks/redux';
import { useDispatch } from 'react-redux';
import { setUsuario } from '../../redux/slices/authSlice';

interface CambioContraseniaFormData {
    contraseniaActual: string;
    contraseniaNueva: string;
    confirmarContrasenia: string;
}

export const PasswordScreen = () => {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const usuario = useAppSelector(state => state.auth.usuario);

    const handleSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Contraseña cambiada con éxito',
            showConfirmButton: false,
            timer: 2000,
        });
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const handleSubmit = async (formData: CambioContraseniaFormData) => {
        setIsLoading(true);
        setServerError('');
        try {
            const data = {
                contraseniaActual: formData.contraseniaActual,
                contraseniaNueva: formData.contraseniaNueva,
            };
            const response = await api.put(`/usuarios/${usuario?.id}/cambiar-contrasenia`, data);

            const { token, usuario:usuarioActualizado } = response.data;

            // Guardar el nuevo token en localStorage
            localStorage.setItem('authToken', token);

             dispatch(setUsuario(usuarioActualizado));
            handleSuccess();
            return response.data;

        } catch (error) {
            setServerError('Error al cambiar la contraseña. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
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
                            Cambiar Contraseña
                        </h2>
                    </div>
                    <div className="px-6 py-4">
                        <PasswordForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isLoading}
                            serverError={serverError}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};
