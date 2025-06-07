import api from './axiosConfig';
export interface Usuario {
  id: number;
  direccion: string | null;
  nombre: string;
  contrasenia: string;
  rol: string;
  email: string;
  dni: string | null;
  password: string; 
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  username: string;
  authorities: "";
  accountNonLocked: boolean;
}

export const usuariosService = {
  // Obtener todos los usuarios
  obtenerUsuarios: async () => {
      const response = await api.get('/usuarios');
      return response.data;
  },

  // Obtener usuario por ID
  obtenerUsuarioPorId: async (id:number) => {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
  },

  // Crear usuario
  crearUsuario: async (usuario:Usuario) => {
      const response = await api.post('/usuarios', usuario);
      return response.data;
  },

  // Actualizar usuario
  actualizarUsuario: async (id:number, usuario:Usuario) => {
      const response = await api.put(`/usuarios/${id}`, usuario);
      return response.data;
  },

  // Eliminar usuario
  eliminarUsuario: async (id:number) => {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
  },

  // Cambiar estado del usuario
  cambiarEstadoUsuario: async (id:number, enabled:boolean) => {
      const response = await api.patch(`/usuarios/${id}/estado`, { enabled });
      return response.data;
  }
};