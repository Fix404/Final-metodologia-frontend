import { IProductoCantidad } from "../types/IProductoCantidad";
import api from "./axiosConfig";

export const productoCantidadService = {
    // Obtener todos los ProductoCantidad
    obtenerProductosCantidad: async () => {
        const response = await api.get('/producto_cantidad');
        return response.data;
    },

    // Obtener ProductoCantidad por ID
    obtenerProductoCantidadPorId: async (id: number) => {
        const response = await api.get(`/producto_cantidad/${id}`);
        return response.data;
    },

    // Crear ProductoCantidad
    crearProductoCantidad: async (productoCantidad: Omit<IProductoCantidad, 'id'>) => {
        const response = await api.post('/producto_cantidad', productoCantidad);
        return response.data;
    },

    // Actualizar ProductoCantidad
    actualizarProductoCantidad: async (id: number, productoCantidad: IProductoCantidad) => {
        const response = await api.put(`/producto_cantidad/${id}`, productoCantidad);
        return response.data;
    },

    // Eliminar ProductoCantidad
    eliminarProductoCantidad: async (id: number) => {
        const response = await api.delete(`/producto_cantidad/${id}`);
        return response.data;
    },

    // Buscar ProductoCantidad por detalle_id y cantidad
    buscarPorDetalleYCantidad: async (detalleId: number, cantidad: number) => {
        const response = await api.get(`/producto_cantidad?detalle_id=${detalleId}&cantidad=${cantidad}`);
        return response.data;
    },
    buscarPorDetalle: async (detalleId: number) => {
    const response = await api.get(`/producto_cantidad?detalle_id=${detalleId}`);
    return response.data;
}
};