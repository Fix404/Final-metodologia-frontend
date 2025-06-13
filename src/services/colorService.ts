import { IColor } from "../types/IColor";
import api from "./axiosConfig"


export const colorService={
    obtenerColores: async() => {
        const response  =await api.get('/colores');
        return response.data;
    },
    obtenerColoresActivos: async() => {
        const response=await api.get('/colores/activos');
        return response.data;
    },
    obtenerColorPorId: async(id:number) => {
        const response = await api.get(`/colores/${id}`);
        return response.data;
    },
    crearColor: async(color:IColor) =>{
        const response=await api.post('/colores', color)
        return response.data;
    },
    actualizarColor: async (id: number, color: IColor) => {
    const response = await api.put(`/colores/${id}`, color);
    return response.data;
  },
  eliminarColor: async (id: number) => {
    const response = await api.put(`/colores/estado/${id}?activo=false`);
    return response.data;
  },
  cambiarEstadoColor: async (id: number, activo: boolean) => {
    const response = await api.put(`/colores/estado/${id}?activo=${activo}`);
    return response.data;
  }
}