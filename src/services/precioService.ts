import { IPrecio } from "../types/IPrecio";
import api from "./axiosConfig"


export const precioService={
    obtenerPrecios: async() => {
        const response  =await api.get('/precios');
        return response.data;
    },
    obtenerPreciosActivos: async() => {
        const response=await api.get('/precios/activos');
        return response.data;
    },
    obtenerPrecioPorId: async(id:number) => {
        const response = await api.get(`/precios/${id}`);
        return response.data;
    },
    crearPrecio: async(precio:IPrecio) =>{
        const response=await api.post('/precios', precio)
        return response.data;
    },
    actualizarPrecio: async (id: number, precio: IPrecio) => {
    const response = await api.put(`/precios/${id}`, precio);
    return response.data;
  },
  eliminarPrecio: async (id: number) => {
    const response = await api.put(`/precios/estado/${id}?activo=false`);
    return response.data;
  },
  cambiarEstadoPrecio: async (id: number, activo: boolean) => {
    const response = await api.put(`/precios/estado/${id}?activo=${activo}`);
    return response.data;
  }
}