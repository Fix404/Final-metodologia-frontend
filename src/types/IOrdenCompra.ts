
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
<<<<<<< HEAD

=======
>>>>>>> 8ac119b9b14b8a4ff645c265e80de217d391a577
}
