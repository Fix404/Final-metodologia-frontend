
import { IProductoCantidad } from "./IProductoCantidad";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  activo?: boolean;
  id: number;
  fecha:string;
  precio_total: number;
  usuario: IUsuario;
  movimiento?: string;
<<<<<<< HEAD
  productoCantidad: IProductoCantidad[];
=======
  producto_cantidad_id: number[];
>>>>>>> 9aba06b38efa1f800f5e843c5bed88a32dc4836e
}
