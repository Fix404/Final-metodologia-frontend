import { IDescuento } from "./IDescuento"

export interface IProducto {
    id: number
    name: string
    description: string
    category: string
    type: string
    sex: string
    discount?: IDescuento
    image: string
}
