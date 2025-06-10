import { IDescuento } from "../types/IDescuento";
import api from "./axiosConfig";



export const descuentoService={
    // Obtener todos las Descuentos
  obtenerDescuentos: async () => {
    const response = await api.get('/descuentos');
    return response.data;
  },

  // Obtener solo Descuentos activos
  obtenerDescuentosActivos: async () => {
    const response = await api.get('/descuentos/activos');
    return response.data;
  },

  // Obtener descuento por ID
  obtenerDescuentoPorId: async (id: number) => {
    const response = await api.get(`/descuentos/${id}`);
    return response.data;
  },

  // Crear descuento
  crearDescuento: async (descuento: IDescuento) => {
    const response = await api.post('/descuentos', descuento);
    return response.data;
  },

  // Actualizar descuento
  actualizarDescuento: async (id: number, descuento: IDescuento) => {
    const response = await api.put(`/descuentos/${id}`, descuento);
    return response.data;
  },

  // Eliminar descuento (baja lógica)
  eliminarDescuento: async (id: number) => {
    const response = await api.put(`/descuentos/baja/${id}`);
    return response.data;
  }
}