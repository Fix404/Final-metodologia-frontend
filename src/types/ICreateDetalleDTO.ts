
import { Estado } from "./enums/Estado";

export interface ICreateDetalleDto {
  stock?: number;
  estado?: Estado;
  talleId: number;
  colorId: number;
  precioId: number;
  productoId: number;
  version?: number;   
}
