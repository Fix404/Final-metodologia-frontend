
import { IProductoCantidad } from "./IProductoCantidad";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  activo?: boolean;
  id: number;
  fecha:string;
  precioTotal: number;
  usuario: IUsuario;
  movimiento?: string;
  productoCantidad: IProductoCantidad[];
}
