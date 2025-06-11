import { ILocalidad } from "./ILocalidad";

export interface IDireccion {
  id: number;
  calle: string;
  numero: string;
  codigoPostal: string;
  localidad: ILocalidad;
  provincia: string;
}

export interface ICrearDireccion {
  calle: string;
  numero: string;
  codigoPostal: string;
  localidad: ILocalidad;
  provincia: string;
}

// Tipo para respuesta del servidor al crear dirección
export interface IDireccionCreada {
  id: number;
  calle: string;
  numero: string;
  codigoPostal: string;
  localidad: ILocalidad;
  provincia: string;
}