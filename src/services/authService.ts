import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/auth';

export const login = async (email: string, contrasenia: string) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        contrasenia,
    });

     const { token } = response.data;

    // Guardar en localStorage
    localStorage.setItem('token', token);

    return response.data; // Recibe el token
};

export const register = async (
    nombre: string,
    email: string,
    contrasenia: string,
    confirmarContrasenia: string,
    
) => {
    const response = await axios.post(`${API_URL}/register`, {
        nombre,
        email,
        contrasenia,
        confirmarContrasenia
    });

    return response.data;
};
