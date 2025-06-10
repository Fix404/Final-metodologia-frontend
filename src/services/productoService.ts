import { IProducto } from "../types/IProducto";
import api from "./axiosConfig"


export const productoService={
    obtenerProductos: async() => {
        const response  =await api.get('/productos');
        return response.data;
    },
    obtenerProductosActivos: async() => {
        const response=await api.get('/productos/activos');
        return response.data;
    },
    obtenerProductoPorId: async(id:number) => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    },
    crearProducto: async(producto:IProducto) =>{
        const response=await api.post('/productos', producto)
        return response.data;
    },
    actualizarProducto: async (id: number, producto: IProducto) => {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },
  eliminarProducto: async (id: number) => {
    const response = await api.put(`/productos/baja/${id}`);
    return response.data;
  }
}