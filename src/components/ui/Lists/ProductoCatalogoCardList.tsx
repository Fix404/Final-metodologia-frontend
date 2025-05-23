import { IDetalleProducto } from "../../../types/IDetalleProducto";
import ProductoCatalogoCard from "../CardList/ProductoCatalogoCard"

interface ProductoCatalogoCardListProps {
  productos: IDetalleProducto[];
}

export const ProductoCatalogoCardList = ({productos}: ProductoCatalogoCardListProps) => {

    //GetProductos

    return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {productos.length > 0 ? productos.map((producto, index) => (
      <ProductoCatalogoCard key={index} detalleProducto={producto}  />
    )) : <p>No hay productos disponibles</p>}
  </div>
    )
}
