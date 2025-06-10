import { IUsuario } from '../types/IUsuario';
import api from './axiosConfig';

export const usuariosService = {
  // Obtener todos los usuarios
  obtenerUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener solo usuarios activos
  obtenerUsuariosActivos: async () => {
    const response = await api.get('/usuarios/activos');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerUsuarioPorId: async (id: number) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear usuario
  crearUsuario: async (usuario: IUsuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  // Actualizar usuario
  actualizarUsuario: async (id: number, usuario: IUsuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Eliminar usuario (baja lógica)
  eliminarUsuario: async (id: number) => {
    const response = await api.put(`/usuarios/baja/${id}`);
    return response.data;
  }
};
