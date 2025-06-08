import api from "./axiosConfig"


export const productoService={
    obtenerProductos: async() => {
        const response  =await api.get('/productos');
        return response.data;
    },
    obtenerProductoPorId: async(id:number) => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    }
}