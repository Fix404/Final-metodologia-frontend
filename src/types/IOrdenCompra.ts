
import { IProductoCantidad } from "./IProductoCantidad";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  activo: boolean;
  id: number;
  fecha:String;
  precio_total: number;
  usuario: IUsuario;
  movimiento: string;
  producto_cantidad_id: IProductoCantidad;
}
