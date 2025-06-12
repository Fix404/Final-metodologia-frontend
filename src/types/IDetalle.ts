import { Estado } from "./enums/Estado"
import { IColor } from "./IColor"
import { IPrecio } from "./IPrecio"
import { IProducto } from "./IProducto"
import { ITalle } from "./ITalle"

export interface IDetalle {
    id: number | null
    talle: ITalle | null
    color: IColor | null
    precio: IPrecio | null
    stock?: number
    estado?: Estado 
    producto: IProducto | null
    version?: number
}
