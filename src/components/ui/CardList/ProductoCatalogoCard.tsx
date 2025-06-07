import React from 'react';
import { Link } from 'react-router-dom';
import { IDetalle } from '../../../types/IDetalle';

interface ProductCatalogCardProps {
  detalleProducto: IDetalle
}

const ProductoCatalogoCard: React.FC<ProductCatalogCardProps> = ({
  detalleProducto }) => {

  const { talle, color, precio, producto } = detalleProducto

  console.log("Detalle recibido en card:", detalleProducto)

  if (!producto || !precio) {
    return (
      null
    );
  }
  // Calcular descuento
  const finalPrice = producto.descuento
    ? Math.max(0, precio.precioVenta * (1 - producto.descuento.porcentaje / 100))
    : precio.precioVenta;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform hover:shadow-xl hover:scale-105 ">
      <div className="p-2 ">
        {/* Product Name */}
        <h3 className="text-gray-700 font-semibold text-center mb-1">{producto.nombre}</h3>

        {/* Product Image */}
        <div className="bg-white p-2 mb-2">
          <img
            src={producto.imagen.url || ""}
            alt={producto.imagen.altDescripcion}
            className="w-full h-40 object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="px-2 py-1">
          {/* Price */}

          <p className="text-gray-800">
            <span className="font-bold">Precio: </span>

            {producto.descuento ? (
              <>
                <span className="line-through text-gray-400">${precio.precioVenta.toFixed(2)}</span>
                <span className="text-red-600 font-bold ml-2">${finalPrice.toFixed(2)}</span>
              </>
            ) : (
              <span>${precio.precioVenta.toFixed(2)}</span>
            )}
          </p>

          {/*  {talle.length > 0 && (
            <p className="text-gray-800">
              <span className="font-bold">Talle: </span>
              <span>{talle.talle}</span>
               </p>

            <p className="text-gray-800">
              <span className="font-bold">Colores: </span>
              <span>{color.map(c => c.color).join(", ")}</span>
            </p>
          )} */}

          {/* Talle */}
{talle && (
  <p className="text-gray-800">
    <span className="font-bold">Talle: </span>
    <span>{talle.talle}</span>
  </p>
)}

{/* Color */}
{color && (
  <p className="text-gray-800">
    <span className="font-bold">Color: </span>
    <span>{color.color}</span>
  </p>
)}

         


        </div>

        {/* Action Buttons */}
        <div className="flex mt-3">
          <Link
            to={`/detalle/${detalleProducto.id}`}
            to={`/detalle/${detalleProducto.id}`}
            className="bg-[#1c4577] text-white text-center py-2 flex-1 mr-1 rounded hover:bg-blue-800 transition-colors"
          >
            Ver Más
          </Link>
          <button
            className="bg-[#1c4577] text-white text-center py-2 flex-1 ml-1 rounded hover:bg-blue-800 transition-colors"
            onClick={() => {
              // Add to cart functionality would go here
              console.log(`Added product ${producto.id} to cart`);
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