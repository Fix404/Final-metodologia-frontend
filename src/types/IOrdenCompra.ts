import { IDetalle } from "./IDetalle";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  id: number;
  fecha: string;
  total: number;
  usuario: IUsuario;
  detalles: IDetalle[];
}
