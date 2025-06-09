import { IOrdenCompra } from "../types/IOrdenCompra";
import api from "./axiosConfig";

export const ordenesCompraService={
    // Obtener todos los ordenCompras
  obtenerOrdenesCompra: async () => {
      const response = await api.get('/orden_compra');
      return response.data;
  },

  // Obtener ordenCompra por ID
  obtenerOrdenesCompraPorId: async (id:number) => {
      const response = await api.get(`/orden_compra/${id}`);
      return response.data;
  },

  // Crear ordenCompra
  crearOrdenCompra: async (ordenCompra:IOrdenCompra) => {
      const response = await api.post('/orden_compra', ordenCompra);
      return response.data;
  },

  // Actualizar ordenCompra
  actualizarOrdenCompra: async (id:number, ordenCompra:IOrdenCompra) => {
      const response = await api.put(`/orden_compra/${id}`, ordenCompra);
      return response.data;
  },

  // Eliminar ordenCompra
  eliminarOrdenCompra: async (id:number) => {
      const response = await api.delete(`/orden_compra/${id}`);
      return response.data;
  },

  // Cambiar estado del ordenCompra
  cambiarEstadoOrdenCompra: async (id:number, enabled:boolean) => {
      const response = await api.patch(`/orden_compra/${id}/estado`, { enabled });
      return response.data;
  }
}