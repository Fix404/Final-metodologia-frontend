import { IDireccion } from "./IDireccion";

export interface IUsuario {
  id: number | null;
  nombre: string;
  apellido: string | null;
  email: string;
  contrasenia: string;
  direccion?: IDireccion | null;
  dni?: number | null;
  rol?: string;
}
