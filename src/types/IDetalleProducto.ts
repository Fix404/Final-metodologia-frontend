import { IColor } from "./IColor"
import { IPrecio } from "./IPrecio"
import { IProducto } from "./IProducto"
import { ITalle } from "./ITalle"

export interface IDetalleProducto {
    id: number
    size?: ITalle
    colors: IColor[]
    price: IPrecio 
    stock: number
    state?: string 
    product: IProducto
}
