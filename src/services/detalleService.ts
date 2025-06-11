import { IDetalle } from "../types/IDetalle";
import api from "./axiosConfig"


export const detalleService={
    obtenerDetalles: async() => {
        const response  =await api.get('/detalle');
        return response.data;
    },
    obtenerDetallesActivos: async() => {
        const response=await api.get('/detalle/activos');
        return response.data;
    },
    obtenerDetallePorId: async(id:number) => {
        const response = await api.get(`/detalle/${id}`);
        return response.data;
    },
    crearDetalle: async(detalle:IDetalle) =>{
        const response=await api.post('/detalle', detalle)
        return response.data;
    },
    actualizarDetalle: async (id: number, detalle: IDetalle) => {
    const response = await api.put(`/detalle/${id}`, detalle);
    return response.data;
  },
  eliminarDetalle: async (id: number) => {
    const response = await api.put(`/detalle/estado/${id}?activo=false`);
    return response.data;
  },
  cambiarEstadoDetalle: async (id: number, activo: boolean) => {
    const response = await api.put(`/detalle/estado/${id}?activo=${activo}`);
    return response.data;
  }
}