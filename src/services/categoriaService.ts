import { ICategoria } from "../types/ICategoria";
import api from "./axiosConfig";


export const categoriaService= {
    // Obtener todos las categorias
  obtenerCategorias: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  // Obtener solo categorias activas
  obtenerCategoriasActivos: async () => {
    const response = await api.get('/categorias/activos');
    return response.data;
  },

  // Obtener categoria por ID
  obtenerCategoriaPorId: async (id: number) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  // Crear categoria
  crearCategoria: async (categoria: ICategoria) => {
    const response = await api.post('/categorias', categoria);
    return response.data;
  },

  // Actualizar categoria
  actualizarCategoria: async (id: number, categoria: ICategoria) => {
    const response = await api.put(`/categorias/${id}`, categoria);
    return response.data;
  },

  // Eliminar categoria (baja lógica)
  eliminarCategoria: async (id: number) => {
    const response = await api.put(`/categorias/estado/${id}?activo=false`);
    return response.data;
  },

  // Restore
  cambiarEstadoCategoria: async(id:number, activo:boolean)=>{
    const response = await api.put(`/categorias/estado/${id}?activo=${activo}`);
    return response.data;
  }
}