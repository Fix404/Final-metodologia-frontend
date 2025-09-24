import { ITalle } from "../types/ITalle";
import api from "./axiosConfig"


export const talleService={
    obtenerTalles: async() => {
        const response  =await api.get('/talles');
        return response.data;
    },
    obtenerTallesActivos: async() => {
        const response=await api.get('/talles/activos');
        return response.data;
    },
    obtenerTallePorId: async(id:number) => {
        const response = await api.get(`/talles/${id}`);
        return response.data;
    },
    crearTalle: async(precio:ITalle) =>{
        const response=await api.post('/talles', precio)
        return response.data;
    },
    actualizarTalle: async (id: number, precio: ITalle) => {
    const response = await api.put(`/talles/${id}`, precio);
    return response.data;
  },
  eliminarTalle: async (id: number) => {
    const response = await api.put(`/talles/estado/${id}?activo=false`);
    return response.data;
  },
  cambiarEstadoTalle: async (id: number, activo: boolean) => {
    const response = await api.put(`/talles/estado/${id}?activo=${activo}`);
    return response.data;
  }
}