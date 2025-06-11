import { ILocalidad } from '../types/ILocalidad';
import api from './axiosConfig';

export const localidadService = {
  // Obtener todas las localidades
  obtenerLocalidades: async () => {
    const response = await api.get('/localidad');
    return response.data;
  },

  // Obtener localidad por ID
  obtenerLocalidadPorId: async (id: number) => {
    const response = await api.get(`/localidad/${id}`);
    return response.data;
  },

  // Crear nueva localidad
  crearLocalidad: async (localidad: Omit<ILocalidad, 'id'>) => {
    const response = await api.post('/localidad', localidad);
    return response.data;
  },

  // Actualizar localidad
  actualizarLocalidad: async (id: number, localidad: ILocalidad) => {
    const response = await api.put(`/localidad/${id}`, localidad);
    return response.data;
  },

  // Buscar localidad por nombre y código postal
  buscarLocalidad: async (localidad: string, codigoPostal: number) => {
    const response = await api.get(`/localidad?localidad=${encodeURIComponent(localidad)}&codigo_postal=${codigoPostal}`);
    return response.data;
  }
};