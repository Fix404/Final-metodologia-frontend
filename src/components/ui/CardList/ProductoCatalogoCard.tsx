import React from 'react';
import { Link } from 'react-router-dom';
import { IProducto } from '../../../types/IProducto';

interface ProductCatalogCardProps {
  producto: IProducto;
  precio?: number;
}


const ProductoCatalogoCard: React.FC<ProductCatalogCardProps> = ({
  producto, precio }) => {

  const { nombre, imagen } = producto

  return (
    <Link className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform hover:shadow-xl hover:scale-105 "
      to={`/productos/${producto.id}`}>
      <div className="p-2 ">
        {/* Product Name */}
        <h3 className="text-gray-700 font-semibold text-center mb-1">{nombre}</h3>

        {/* Product Image */}
        <div className="bg-white p-2 mb-2">
          <img
            src={imagen?.url ?? ''}
            alt={imagen?.altDescripcion ?? ''}
            className="w-full h-40 object-contain"
          />
        </div>

        {/* Product Info */}
{precio !== undefined && (
  <p className="text-center text-green-600 font-semibold">${precio.toFixed(2)}</p>
)}

      </div>
    </Link>
  );
};

export default ProductoCatalogoCard;