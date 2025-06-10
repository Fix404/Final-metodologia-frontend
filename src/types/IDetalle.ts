import { Estado } from "./enums/Estado"
import { IColor } from "./IColor"
import { IPrecio } from "./IPrecio"
import { IProducto } from "./IProducto"
import { ITalle } from "./ITalle"

export interface IDetalle {
    id: number
    talle: ITalle
    color: IColor
    precio: IPrecio 
    stock?: number
    estado?: Estado 
    producto: IProducto
}
