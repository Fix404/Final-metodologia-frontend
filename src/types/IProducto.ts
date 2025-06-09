import { ICategoria } from "./ICategoria"
import { IDescuento } from "./IDescuento"
import { IImagen } from "./IImagen"

export interface IProducto {
    id: number
    nombre: string
    descripcion: string
    categoria: ICategoria
    tipo: string
    sexoProducto: string
    descuento?: IDescuento
    imagen?: IImagen
}
