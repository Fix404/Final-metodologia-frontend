import { IDireccion } from '../types/IDireccion';
import api from './axiosConfig';

export const direccionService = {
  // Obtener todas las direcciones
  obtenerDirecciones: async () => {
    const response = await api.get('/direcciones');
    return response.data;
  },

  // Obtener dirección por ID
  obtenerDireccionPorId: async (id: number) => {
    const response = await api.get(`/direcciones/${id}`);
    return response.data;
  },

  // Crear nueva dirección
  crearDireccion: async (direccion: Omit<IDireccion, 'id'>) => {
    const response = await api.post('/direcciones', direccion);
    return response.data;
  },

  // Actualizar dirección
  actualizarDireccion: async (id: number, direccion: IDireccion) => {
    const response = await api.put(`/direcciones/${id}`, direccion);
    return response.data;
  },

  // Eliminar dirección
  eliminarDireccion: async (id: number) => {
    const response = await api.delete(`/direcciones/${id}`);
    return response.data;
  }
};