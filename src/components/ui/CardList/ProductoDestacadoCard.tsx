import { IProducto } from "../../../types/IProducto";
import { Link } from "react-router-dom";

interface ProductoDestacadoCardProps {
    producto: IProducto;
}

export const ProductoDestacadoCard: React.FC<ProductoDestacadoCardProps> = ({ producto }) => {
    const imagenUrl = producto.imagen?.url || "/images/default-product.png";
    const imagenAlt = producto.imagen?.altDescripcion || "Imagen del producto";
    const descripcion = producto.descripcion || "Sin descripción";

    return (
        <Link
            to={`/productos/${producto.id}`}
            className="shrink-0 flex w-[300px] h-[200px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,4)] hover:shadow-[0_10px_50px_rgba(0,0,0,5)] overflow-hidden transition-shadow duration-300"
        >
            {/* Imagen */}
            <div className="w-1/2 p-2 h-full">
                <img
                    src={imagenUrl}
                    alt={imagenAlt}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Descripción */}
            <div className="w-1/2 h-full flex items-center justify-center p-4 bg-stone-200">
                <p className="text-base text-gray-800 text-center">{descripcion}</p>
            </div>

        </Link>
    );
};
