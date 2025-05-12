import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCatalogCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  size?: string;
  colors?: string[];
  discount?: number;
}

const ProductoCatalogoCard: React.FC<ProductCatalogCardProps> = ({
  id,
  name,
  price,
  image,
  size,
  colors,
  discount
}) => {
  // Calculate discount price if applicable
  const finalPrice = discount ? price - (price * discount / 100) : price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-xl hover:scale-105">
      <div className="p-2">
        {/* Product Name */}
        <h3 className="text-gray-700 font-semibold text-center mb-1">{name}</h3>
        
        {/* Product Image */}
        <div className="bg-blue-50 p-2 mb-2">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-40 object-contain" 
          />
        </div>
        
        {/* Product Info */}
        <div className="px-2 py-1">
          {/* Price */}
          <p className="text-gray-800">
            <span className="font-bold">Precio: </span>
            {discount ? (
              <>
                <span className="line-through text-gray-400">${price.toFixed(2)}</span>
                <span className="text-red-600 font-bold ml-2">${finalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span>${price.toFixed(2)}</span>
            )}
          </p>
          
          {/* Size if available */}
          {size && (
            <p className="text-gray-800">
              <span className="font-bold">Talle: </span>
              <span>{size}</span>
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
            to={`/producto/${id}`}
            className="bg-blue-700 text-white text-center py-2 flex-1 mr-1 rounded hover:bg-blue-800 transition-colors"
          >
            Ver Más
          </Link>
          <button
            className="bg-blue-700 text-white text-center py-2 flex-1 ml-1 rounded hover:bg-blue-800 transition-colors"
            onClick={() => {
              // Add to cart functionality would go here
              console.log(`Added product ${id} to cart`);
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