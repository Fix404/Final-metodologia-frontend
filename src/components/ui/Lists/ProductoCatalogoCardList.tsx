
import { IProducto } from "../../../types/IProducto";
import ProductoCatalogoCard from "../CardList/ProductoCatalogoCard"

interface ProductoCatalogoCardListProps {
  productos: IProducto[];
}

export const ProductoCatalogoCardList = ({productos}: ProductoCatalogoCardListProps) => {

    return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {productos.length > 0 ? productos.map((producto) => (
      <ProductoCatalogoCard key={producto.id} producto={producto}  />
    )) : <p>No hay productos disponibles</p>}
  </div>
    )
}
