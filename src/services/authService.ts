
import api from './axiosConfig';


export const login = async (email: string, contrasenia: string) => {
    const response = await api.post(`/auth/login`, {
        email,
        contrasenia,
    });

     const { token } = response.data;
   

    // Guardar en localStorage
    localStorage.setItem('authToken', token);
   

    return response.data; 
};

export const register = async (
    nombre: string,
    email: string,
    contrasenia: string,
    confirmarContrasenia: string,
    
) => {
    const response = await api.post(`/auth/register`, {
        nombre,
        email,
        contrasenia,
        confirmarContrasenia
    });

    const { token } = response.data;
    localStorage.setItem('authToken', token);

    return response.data;
};
