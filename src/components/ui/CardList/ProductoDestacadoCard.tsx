import { IProducto } from "../../../types/IProducto";
import { Link } from "react-router-dom";

interface ProductoDestacadoCardProps {
    producto: IProducto;
}

export const ProductoDestacadoCard: React.FC<ProductoDestacadoCardProps> = ({ producto }) => {
    const imagenUrl = producto.imagen?.url || "/images/default-product.png";
    const imagenAlt = producto.imagen?.altDescripcion || "Imagen del producto";
    const descripcion = producto.descripcion || "Sin descripción";
    const tieneDescuento = producto.descuento &&
        producto.descuento !== null &&
        new Date() >= new Date(producto.descuento.fechaInicio) &&
        new Date() <= new Date(producto.descuento.fechaFin);

    const porcentajeDescuento = tieneDescuento ? producto.descuento!.porcentaje : 0;

    return (
        <Link
            to={`/productos/${producto.id}`}
            className="shrink-0 flex w-[300px] h-[200px] bg-white rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.9)] hover:shadow-[0px_6px_18px_rgba(0,0,0,1)] hover:-translate-y-2 border border-gray-500 hover:border-gray-600 overflow-hidden transition-all duration-300"
        >

            {/* Productos con descuento activo */}
            {tieneDescuento && (
                <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-[0px_4px_12px_rgba(239,68,68,0.4)] border-2 border-white">
                        -{porcentajeDescuento}%
                    </div>
                </div>
            )}


            <div className="w-1/2 p-2 h-full">
                <img
                    src={imagenUrl}
                    alt={imagenAlt}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="w-1/2 h-full flex items-center justify-center p-4 bg-stone-200 max-xs:hidden max-sm:hidden">
                <p className="text-base text-gray-800 text-center">{descripcion}</p>
            </div>
        </Link>
    );
};