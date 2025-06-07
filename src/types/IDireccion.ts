import { ILocalidad } from "./ILocalidad";

export interface IDireccion {
  id: number;
  calle: string;
  numero: string;
  codigoPostal: string;
  localidad: ILocalidad;
}
