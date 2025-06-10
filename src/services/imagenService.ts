import { IImagen } from "../types/IImagen";
import api from "./axiosConfig";



export const imagenService={
    // Obtener todos las imagenes
  obtenerImagenes: async () => {
    const response = await api.get('/imagenes');
    return response.data;
  },

  // Obtener solo imagenes activos
  obtenerImagenesActivos: async () => {
    const response = await api.get('/imagenes/activos');
    return response.data;
  },

  // Obtener imagen por ID
  obtenerImagenPorId: async (id: number) => {
    const response = await api.get(`/imagenes/${id}`);
    return response.data;
  },

  // Crear imagen
  crearImagen: async (imagen: IImagen) => {
    const response = await api.post('/imagenes', imagen);
    return response.data;
  },

  // Actualizar imagen
  actualizarImagen: async (id: number, imagen: IImagen) => {
    const response = await api.put(`/imagenes/${id}`, imagen);
    return response.data;
  },

  // Eliminar imagen (baja lógica)
  eliminarImagen: async (id: number) => {
    const response = await api.put(`/imagenes/baja/${id}`);
    return response.data;
  }
}