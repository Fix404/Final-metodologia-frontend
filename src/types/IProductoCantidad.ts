import { IDetalle } from "./IDetalle";

export interface IProductoCantidad {
    id: number;
    detalle_id: IDetalle;
    cantidad: number;
}
