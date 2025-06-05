import { IProducto } from "../../../types/IProducto";

interface ProductoDestacadoCardProps {
    producto: IProducto;
}

export const ProductoDestacadoCard: React.FC<ProductoDestacadoCardProps> = ({ producto }) => {
    return (
        <div className="shrink-0 flex w-[300px] h-[200px] bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Imagen */}
            <div className="w-1/2 h-full">
                <img
                    src={producto.imagen.url}
                    alt={producto.imagen.altDescripcion}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Descripción */}
            <div className="w-1/2 h-full flex items-center justify-center p-4 bg-gray-100">
                <p className="text-sm text-gray-700 text-center">{producto.descripcion}</p>
            </div>
        </div>
    );
};
