import React from 'react';
import { Link } from 'react-router-dom';
import { IDetalleProducto } from '../../../types/IDetalleProducto';

interface ProductCatalogCardProps {
  detalleProducto: IDetalleProducto
}

const ProductoCatalogoCard: React.FC<ProductCatalogCardProps> = ({
  detalleProducto }) => {

  const { size, colors, price, product} = detalleProducto

  // Calculate discount price if applicable
  const finalPrice = product.discount ? price.salePrice - (price.salePrice * product.discount.percentage / 100) : price.salePrice;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-xl hover:scale-105">
      <div className="p-2">
        {/* Product Name */}
        <h3 className="text-gray-700 font-semibold text-center mb-1">{product.name}</h3>

        {/* Product Image */}
        <div className="bg-blue-50 p-2 mb-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="px-2 py-1">
          {/* Price */}
          <p className="text-gray-800">
            <span className="font-bold">Precio: </span>
            {product.discount ? (
              <>
                <span className="line-through text-gray-400">${price.salePrice.toFixed(2)}</span>
                <span className="text-red-600 font-bold ml-2">${finalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span>${price.salePrice.toFixed(2)}</span>
            )}
          </p>

          {/* Size if available */}
          {size && (
            <p className="text-gray-800">
              <span className="font-bold">Talle: </span>
              <span>{size.size}</span>
            </p>
          )}

          {/* Colors if available */}
          {colors && colors.length > 0 && (
            <p className="text-gray-800">
              <span className="font-bold">Colores: </span>
              <span>{colors.join(', ')}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex mt-3">
          <Link
            to={`/producto/${product.id}`}
            className="bg-blue-700 text-white text-center py-2 flex-1 mr-1 rounded hover:bg-blue-800 transition-colors"
          >
            Ver Más
          </Link>
          <button
            className="bg-blue-700 text-white text-center py-2 flex-1 ml-1 rounded hover:bg-blue-800 transition-colors"
            onClick={() => {
              // Add to cart functionality would go here
              console.log(`Added product ${product.id} to cart`);
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCatalogoCard;