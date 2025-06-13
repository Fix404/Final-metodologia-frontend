import { IDetalle } from "./IDetalle";

export interface IProductoCantidad {
    id: number;
    detalle: IDetalle;
    cantidad: number;
}
