import { IDireccion } from "./IDireccion";

export interface IUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  direccion?: IDireccion;
  dni?: number;
  rol?: string;
}
