import { ICreateDireccionDTO } from "./ICreateDireccionDTO";

export interface ICreateUsuarioDTO {
  nombre: string;
  apellido?: string | null;
  email: string;
  contrasenia: string;
  dni?: number | null;
  rol: 'ADMIN' | 'USUARIO'; 
  activo: boolean;
  direccion?: ICreateDireccionDTO | null;
}
