import React, { useState, useEffect } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { IDetalle } from '../../types/IDetalle';
import { ITalle } from '../../types/ITalle';
import { IColor } from '../../types/IColor';
import { useParams } from 'react-router-dom';

interface DetalleScreenProps {
    detalleProducto?: IDetalle[];
}

const DetalleScreen: React.FC<DetalleScreenProps> = ({ detalleProducto }) => {
 
    // Este console.log no está recibiendo el detalle producto, hay que hacer unos pasos
 console.log("Detalle recibido:", detalleProducto);
      
    /*const mockDetalles: IDetalle[] = [
        {
            id: 1,
            color: [
                { id: 1, color: 'Blanco' },
                { id: 2, color: 'Negro' }
            ],
            talle: [
                { id: 1, talle: 'M' },
                { id: 2, talle: 'L' }
            ],
            precio: { id: 1, precioCompra: 60000, precioVenta: 150000 },
            stock: 5,
            producto: {
                id: 1,
                nombre: 'ZAPATILLAS DEPORTIVAS',
                descripcion: 'Descripción de ejemplo ',
                categoria: { id: 1, nombre: 'Ropa' },
                tipo: 'Conjunto',
                sexoProducto: 'Mujer',
                descuento: { id: 1, fechaInicio: '2025-01-01', fechaFin: '2025-12-31', porcentaje: 15 },
                imagen: { id: 1, url: "https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api", altDescripcion: 'Conjunto' }
            }
        },
        {
            id: 2,
            color: [
                { id: 3, color: 'Marrón' }
            ],
            talle: [
                { id: 2, talle: 'L' },
                { id: 3, talle: 'XL' }
            ],
            precio: { id: 2, precioCompra: 70000, precioVenta: 110000 },
            stock: 2,
            producto: {
                id: 1,
                nombre: 'CONJUNTO NOMBRE',
                descripcion: 'Descripción',
                categoria: { id: 1, nombre: 'Ropa' },
                tipo: 'Conjunto',
                sexoProducto: 'Mujer',
                descuento: { id: 1, fechaInicio: '2025-01-01', fechaFin: '2025-12-31', porcentaje: 15 },
                imagen: { id: 1, url: "https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api", altDescripcion: 'Conjunto' }
            }
        }
    ];*/

   // const detalles = detalleProducto ?? []; // ?? mockProductos


    //const producto = detalles[0]?.producto;

    /* const coloresDisponibles: IColor[] = Array.from(
         new Map(detalles.flatMap(d => d.color).map(c => [c.color, c])).values()
     );
 
     const tallesDisponibles: ITalle[] = Array.from(
         new Map(detalles.flatMap(d => d.talle).map(t => [t.talle, t])).values()
     );*/

  /*  const coloresDisponibles: IColor[] = Array.from(
        new Map(detalles.map(d => [d.color.color, d.color])).values()
    );*/


    /*const tallesDisponibles: ITalle[] = Array.from(
        new Map(detalles.map(d => [d.talle.talle, d.talle])).values()
    );*/


    /*const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedTalle, setSelectedTalle] = useState<string | null>(null);*/

   /* useEffect(() => {
        setSelectedColor(coloresDisponibles[0]?.color ?? null);
        setSelectedTalle(tallesDisponibles[0]?.talle ?? null);
    }, [detalleProducto]);*/

    /*const detalleSeleccionado = detalles.find(d =>
        d.color.some(c => c.color === selectedColor) &&
        d.talle.some(t => t.talle === selectedTalle)
    );*/
    const detalleSeleccionado = detalles.find(
        d => d.color.color === selectedColor && d.talle.talle === selectedTalle
    );


    const getColorHex = (colorName: string): string => {
        const colorMap: { [key: string]: string } = {
            'Blanco': '#FFFFFF', 'Negro': '#000000', 'Rojo': '#FF0000',
            'Azul': '#0000FF', 'Verde': '#008000', 'Rosa': '#FFC0CB',
            'Gris': '#808080', 'Amarillo': '#FFFF00', 'Naranja': '#FFA500',
            'Marrón': '#8B4513'
        };
        return colorMap[colorName] || '#CCCCCC';
    };

    const calculateFinalPrice = () => {
        const base = detalleSeleccionado?.precio?.precioVenta || 0;
        const descuento = producto?.descuento?.porcentaje ?? 0;
        return Math.round(base * (1 - descuento / 100));
    };

    const handleAddToCart = () => {
        if (!detalleSeleccionado) return;
        console.log('Agregado al carrito:', {
            productId: detalleSeleccionado.producto.id,
            color: selectedColor,
            talle: selectedTalle,
            price: calculateFinalPrice()
        });
    };

    return (
        <div
            className="bg-[#fdfae8] min-h-screen py-8 px-4 flex flex-col items-center justify-start">
            <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-10 h-full">
                {/* Imagen */}
                <div className="w-full lg:w-1/2">
                    <img
                        src={producto?.imagen?.url}
                        alt={producto?.imagen?.altDescripcion}
                        className="max-h-screen h-auto w-auto mx-auto"
                    />
                </div>

                {/* Detalles */}
                <div className="pl-5 w-full lg:w-1/2 flex flex-col justify-between flex-1 max-h-screen overflow-auto">
                    {/* Contenido superior - información del producto */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-800">{producto?.nombre}</h1>
                        <p className="text-lg text-gray-600">{producto?.descripcion}</p>

                        {/* Colores */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Color</h3>
                            <div className="flex gap-2 mt-1">
                                {coloresDisponibles.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedColor(color.color)}
                                        style={{ backgroundColor: getColorHex(color.color) }}
                                        className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor === color.color
                                            ? 'border-gray-600 scale-110'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        title={color.color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Talles */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Talle</h3>
                            <div className="flex gap-2 mt-1">
                                {tallesDisponibles.map((talle, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedTalle(talle.talle)}
                                        className={`px-4 py-2 rounded border text-sm font-semibold ${selectedTalle === talle.talle
                                            ? 'bg-[#27548ad5] text-white border-blue-600'
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        {talle.talle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contenido inferior - precio, stock y botón */}
                    <div className="space-y-4">
                        {/* Precio y stock */}
                        {detalleSeleccionado && (
                            <>
                                <div>
                                    {producto?.descuento ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-bold text-black">
                                                ${calculateFinalPrice().toLocaleString()}
                                            </span>
                                            <span className="text-xl line-through text-gray-500">
                                                ${detalleSeleccionado.precio.precioVenta.toLocaleString()}
                                            </span>
                                            <span className="text-xl text-green-700 font-semibold">
                                                -{producto.descuento.porcentaje}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-800">
                                            ${detalleSeleccionado.precio.precioVenta.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <div className="text-base text-gray-600">
                                    Stock disponible: {detalleSeleccionado.stock}
                                </div>
                            </>
                        )}

                        {/* Botón */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!detalleSeleccionado || detalleSeleccionado.stock === 0}
                            className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${detalleSeleccionado && detalleSeleccionado.stock > 0
                                ? 'bg-[#1c4577] hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {detalleSeleccionado?.stock === 0
                                ? 'Sin stock'
                                : <>Agregar al carrito <FaCartPlus /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleScreen;