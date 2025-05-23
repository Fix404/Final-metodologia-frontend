import React, { useState } from 'react';
import { IDetalleProducto } from '../../types/IDetalleProducto';
import { IProducto } from '../../types/IProducto';
import { IDescuento } from '../../types/IDescuento';
import { ITalle } from '../../types/ITalle';
import { IColor } from '../../types/IColor';
import { IPrecio } from '../../types/IPrecio';
interface DetalleScreenProps {
    detalleProducto?: IDetalleProducto;
}

const DetalleScreen: React.FC<DetalleScreenProps> = ({ detalleProducto }) => {
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Mock data para demostración
    const mockDescuento: IDescuento = {
        id: 1,
        startDate: '2025-01-01',
        closeDate: '2025-12-31',
        percentage: 15
    };

    const mockProducto: IProducto = {
        id: 1,
        name: 'CONJUNTO NOMBRE',
        description: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.',
        category: 'Ropa',
        type: 'Conjunto',
        sex: 'Mujer',
        discount: mockDescuento,
        image: 'https://via.placeholder.com/400x500/f5f5dc/333?text=Conjunto'
    };

    const mockPrecio: IPrecio = {
        id: 1,
        purchasePrice: 10000,
        salePrice: 15900
    };

    const mockColores: IColor[] = [
        { id: 1, color: 'Blanco' },
        { id: 2, color: 'Marrón' },
        { id: 3, color: 'Negro' }
    ];

    const mockTalle: ITalle = {
        id: 1,
        size: 'M'
    };

    const mockDetalleProducto: IDetalleProducto = {
        id: 1,
        size: mockTalle,
        colors: mockColores,
        price: mockPrecio,
        stock: 10,
        state: 'active',
        product: mockProducto
    };

    const producto = detalleProducto || mockDetalleProducto;
    const availableSizes = ['S', 'M', 'L'];

    // Mapeo de colores a valores hex para mostrar
    const getColorHex = (colorName: string): string => {
        const colorMap: { [key: string]: string } = {
            'Blanco': '#FFFFFF',
            'Marrón': '#8B4513',
            'Negro': '#000000',
            'Rojo': '#FF0000',
            'Azul': '#0000FF',
            'Verde': '#008000',
            'Rosa': '#FFC0CB',
            'Gris': '#808080',
            'Amarillo': '#FFFF00',
            'Naranja': '#FFA500'
        };
        return colorMap[colorName] || '#CCCCCC';
    };

    // Calcular precio con descuento si existe
    const calculateFinalPrice = (): number => {
        const basePrice = producto.price.salePrice;
        if (producto.product.discount) {
            const discount = producto.product.discount.percentage / 100;
            return Math.round(basePrice * (1 - discount));
        }
        return basePrice;
    };

    const handleAddToCart = () => {
        console.log('Agregado al carrito:', {
            productId: producto.id,
            selectedColor: producto.colors[selectedColorIndex],
            selectedSize,
            price: calculateFinalPrice()
        });
    };

    const nextImage = () => {
        // En este caso solo tenemos una imagen, pero mantenemos la funcionalidad
        setCurrentImageIndex(0);
    };

    const prevImage = () => {
        // En este caso solo tenemos una imagen, pero mantenemos la funcionalidad
        setCurrentImageIndex(0);
    };

    return (
        <div className="h-screen bg-gradient-to-b bg-[#fdfae8] overflow-hidden">
            <div className="h-full flex items-center justify-center p-5 mt-4 mx-6">
                <div className="flex flex-col lg:flex-row gap-6 max-w-7xl w-full h-full max-h-[calc(100vh-2rem)]">
                    {/* Sección de imágenes */}
                    <div className="lg:w-1/2 h-full flex items-start">            <div className="relative bg-gray-200 rounded-lg overflow-hidden w-full" style={{ aspectRatio: '1/1', maxHeight: '70vh' }}>
                        {producto.product.image ? (
                            <>
                                <img
                                    src={producto.product.image}
                                    alt={producto.product.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Controles de navegación personalizados */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                                >
                                    <span className="text-gray-700 text-xl font-bold">‹</span>
                                </button>

                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-colors"
                                >
                                    <span className="text-gray-700 text-xl font-bold">›</span>
                                </button>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                <span className="text-gray-500">Imagen no disponible</span>
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Sección de detalles */}
                    <div className="lg:w-1/2 h-full overflow-y-auto">
                        <div className="space-y-4 px-1 ">
                            {/* Título */}
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                {producto.product.name}
                            </h1>

                            {/* Descripción */}
                            <div>
                                <h2 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                    Descripción
                                </h2>
                                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                                    {producto.product.description}
                                </p>
                            </div>
                            {/* Selector de color */}
                            <div>
                                <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                    Color
                                </h3>
                                <div className="flex gap-2">
                                    {producto.colors.map((color, index) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColorIndex(index)}
                                            className={`w-9 h-9 lg:w-12 lg:h-12 rounded-full border-4 transition-all ${selectedColorIndex === index
                                                ? 'border-gray-400 scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{ backgroundColor: getColorHex(color.color) }}
                                            title={color.color}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                    Seleccionado: {producto.colors[selectedColorIndex]?.color}
                                </p>
                            </div>
                            {/* Selector de talle */}
                            <div>
                                <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                                    Talle
                                </h3>
                                <div className="flex items-center gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-10 h-10 lg:w-11.5 lg:h-11.5 rounded-full border-2 font-semibold text-sm lg:text-base transition-colors ${selectedSize === size
                                                ? 'border-blue-500 bg-[#27548ad5] text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>

                                    ))}
                                    {!selectedSize && producto.stock > 0 && (
                                        <p className="text-xs lg:text-sm text-red-500 mt-1">
                                            Selecciona un talle para continuar
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Precio y descuento */}
                            <div className='flex flex-row justify-between w-full items-end'>
                                {producto.product.discount ? (
                                    <div className="flex flex-row gap-1.5 mb-2">

                                        <div className="text-2xl lg:text-3xl font-bold text-black">
                                            ${calculateFinalPrice().toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="12px lg:text-xl line-through text-gray-500">
                                                ${producto.price.salePrice.toLocaleString()}
                                            </span>
                                            <span className="text-green-800 py-1 rounded text-base font-semibold">
                                                -{producto.product.discount.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                                        ${producto.price.salePrice.toLocaleString()}
                                    </div>
                                )}

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize || producto.stock === 0}
                                    className={`w-44 h-10 py-1 px-4 lg:px-6 rounded-lg font-semibold text-white text-sm lg:text-base transition-colors ${selectedSize && producto.stock > 0
                                        ? 'bg-[#1c4577] hover:bg-blue-700 active:bg-blue-800'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                                </button>

                            </div>

                            {/* Información de stock */}
                            {producto.stock <= 5 && producto.stock > 0 && (
                                <div className="text-xs lg:text-sm text-orange-600 bg-orange-50 p-2 lg:p-3 rounded-lg">
                                    ⚠️ ¡Solo quedan {producto.stock} unidades disponibles!
                                </div>
                            )}

                            {producto.stock === 0 && (
                                <div className="text-xs lg:text-sm text-red-600 font-semibold bg-red-50 p-2 lg:p-3 rounded-lg">
                                    ❌ Producto agotado
                                </div>
                            )}

                            {/* Información del descuento si existe */}
                            {producto.product.discount && (
                                <div className="bg-white p-2 lg:p-3 rounded-lg">
                                    <p className="text-xs lg:text-sm text-green-700">
                                        🎉 <span className="font-semibold">Oferta especial:</span> {producto.product.discount.percentage}% de descuento
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        Válido hasta: {new Date(producto.product.discount.closeDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleScreen;