import { IDetalle } from "./IDetalle";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  id: number;
  fecha: string; // o Date, si la transformás
  total: number;
  usuario: IUsuario;
  detalles: IDetalle[];
}
