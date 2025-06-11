import { ICategoria } from "./ICategoria"
import { IDescuento } from "./IDescuento"
import { IImagen } from "./IImagen"

export interface IProducto {
    id: number | null
    nombre: string
    descripcion: string
    categoria: ICategoria | null
    tipo: string | null
    sexoProducto: string | null
    descuento?: IDescuento | null
    imagen?: IImagen | null,
    activo: boolean
}
