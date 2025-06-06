import React, { useState, useEffect } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { IDetalle } from '../../types/IDetalle';
import { ITalle } from '../../types/ITalle';
import { IColor } from '../../types/IColor';
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito, quitarDelCarrito } from '../../redux/slices/CarritoSlice';
import { descontarStock, restaurarStock } from '../../redux/slices/detalleProductoSlice';
import { RootState } from '../../redux/store';

interface DetalleScreenProps {
  detalleProducto?: IDetalle[];
}

const DetalleScreen: React.FC<DetalleScreenProps> = ({ detalleProducto }) => {
  const mockDetalles: IDetalle[] = [
    {
      id: 1,
      color: { id: 1, color: 'Blanco' },
      talle: { id: 1, talle: 'M' },
      precio: { id: 1, precioCompra: 60000, precioVenta: 150000 },
      stock: 5,
      producto: {
        id: 1,
        nombre: 'ZAPATILLAS DEPORTIVAS',
        descripcion: 'Descripción de ejemplo',
        categoria: { id: 1, nombre: 'Ropa' },
        tipo: 'Conjunto',
        sexoProducto: 'Mujer',
        descuento: {
          id: 1,
          fechaInicio: '2025-01-01',
          fechaFin: '2025-12-31',
          porcentaje: 15
        },
        imagen: {
          id: 1,
          url: 'https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api',
          altDescripcion: 'Conjunto'
        }
      }
    },
    {
      id: 2,
      color: { id: 2, color: 'Negro' },
      talle: { id: 2, talle: 'L' },
      precio: { id: 2, precioCompra: 70000, precioVenta: 110000 },
      stock: 2,
      producto: {
        id: 1,
        nombre: 'ZAPATILLAS DEPORTIVAS',
        descripcion: 'Descripción de ejemplo',
        categoria: { id: 1, nombre: 'Ropa' },
        tipo: 'Conjunto',
        sexoProducto: 'Mujer',
        descuento: {
          id: 1,
          fechaInicio: '2025-01-01',
          fechaFin: '2025-12-31',
          porcentaje: 15
        },
        imagen: {
          id: 1,
          url: 'https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api',
          altDescripcion: 'Conjunto'
        }
      }
    },
    {
      id: 3,
      color: { id: 3, color: 'Marrón' },
      talle: { id: 3, talle: 'S' },
      precio: { id: 3, precioCompra: 60000, precioVenta: 150000 },
      stock: 5,
      producto: {
        id: 1,
        nombre: 'ZAPATILLAS DEPORTIVAS',
        descripcion: 'Descripción de ejemplo',
        categoria: { id: 1, nombre: 'Ropa' },
        tipo: 'Conjunto',
        sexoProducto: 'Mujer',
        descuento: {
          id: 1,
          fechaInicio: '2025-01-01',
          fechaFin: '2025-12-31',
          porcentaje: 15
        },
        imagen: {
          id: 1,
          url: 'https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api',
          altDescripcion: 'Conjunto'
        }
      }
    }, {
      id: 4,
      color: { id: 4, color: 'Blanco' },
      talle: { id: 4, talle: 'L' },
      precio: { id: 4, precioCompra: 60000, precioVenta: 150000 },
      stock: 5,
      producto: {
        id: 1,
        nombre: 'ZAPATILLAS DEPORTIVAS',
        descripcion: 'Descripción de ejemplo',
        categoria: { id: 1, nombre: 'Ropa' },
        tipo: 'Conjunto',
        sexoProducto: 'Mujer',
        descuento: {
          id: 1,
          fechaInicio: '2025-01-01',
          fechaFin: '2025-12-31',
          porcentaje: 15
        },
        imagen: {
          id: 1,
          url: 'https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api',
          altDescripcion: 'Conjunto'
        }
      }
    }
  ];
  const detalles = detalleProducto ?? mockDetalles;
  const producto = detalles[0]?.producto;

  // Colores y talles únicos
  const coloresDisponibles: IColor[] = Array.from(
    new Map(detalles.map(d => [d.color.color, d.color])).values()
  );
  const tallesDisponibles: ITalle[] = Array.from(
    new Map(detalles.map(d => [d.talle.talle, d.talle])).values()
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedTalle, setSelectedTalle] = useState<string | null>(null);

  const dispatch = useDispatch();

  const carritoItems = useSelector((state: RootState) => state.carrito.items);

  const detalleSeleccionado = detalles.find(
    d => d.color.color === selectedColor && d.talle.talle === selectedTalle
  );

  const cantidadEnCarrito = carritoItems.find(
    item => item.detalle.id === detalleSeleccionado?.id)
    ?.cantidad || 0;

  const handleAgregarAlCarrito = () => {
    if (!detalleSeleccionado || detalleSeleccionado.stock === 0) return;
    if (cantidadEnCarrito >= detalleSeleccionado.stock) return; // No agregar si ya no hay stock

    dispatch(agregarAlCarrito(detalleSeleccionado));
    dispatch(descontarStock(detalleSeleccionado.id));
  };

  {/*const handleQuitarDelCarrito = () => {
    if (!detalleSeleccionado) return;
    dispatch(quitarDelCarrito(detalleSeleccionado.id));
    const cantidadQuitada = carritoItems.find(item => item.detalle.id === detalleSeleccionado.id)?.cantidad || 0;
    for (let i = 0; i < cantidadQuitada; i++) {
      dispatch(restaurarStock(detalleSeleccionado.id));
    }
  };*/}

  useEffect(() => {
    if (coloresDisponibles.length > 0) setSelectedColor(coloresDisponibles[0].color);
    if (tallesDisponibles.length > 0) setSelectedTalle(tallesDisponibles[0].talle);
  }, [detalleProducto]);

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

  return (
    <div className="bg-[#fdfae8] min-h-screen py-8 px-4 flex flex-col items-center justify-start">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-10 h-full">
        <div className="w-full lg:w-1/2">
          <img
            src={producto?.imagen?.url}
            alt={producto?.imagen?.altDescripcion}
            className="max-h-screen h-auto w-auto mx-auto"
          />
        </div>

        <div className="pl-5 w-full lg:w-1/2 flex flex-col justify-between flex-1 max-h-screen overflow-auto">
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
              <div className="flex gap-3 mt-1">
                {tallesDisponibles.map((talle, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTalle(talle.talle)}
                    className={`h-11 w-11 px-3 py-1 rounded-md text-1x2 font-semibold transition-all ${selectedTalle === talle.talle
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }`}
                  >
                    {talle.talle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Parte inferior: precio, stock, botones */}
          <div className="space-y-4 mt-6">
            {/* Stock */}
            <div className="flex items-center flex-wrap">
              <span className="font-semibold text-gray-700">
                Stock disponible: {detalleSeleccionado?.stock != null
                  ? detalleSeleccionado.stock - cantidadEnCarrito
                  : 0}
              </span>

              <div className="flex justify-between w-full items-center">
                <span className="font-semibold text-gray-700">
                  En carrito: {cantidadEnCarrito}
                </span>
                {/* Precio */}
                {detalleSeleccionado && detalleSeleccionado.stock > 0 && (
                  <div>
                    {producto?.descuento?.porcentaje ? (
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="text-gray-500 line-through font-semibold text-xl">
                            ${detalleSeleccionado.precio?.precioVenta}
                          </span>
                          <span className="text-green-600 text-xl font-semibold">
                            -{producto.descuento.porcentaje}%
                          </span>
                        </div>
                        <span className="text-black font-bold text-3xl">
                          ${calculateFinalPrice()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-bold text-2xl">
                        ${detalleSeleccionado.precio?.precioVenta}
                      </span>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAgregarAlCarrito}
              disabled={
                !detalleSeleccionado ||
                detalleSeleccionado.stock === 0 ||
                cantidadEnCarrito >= detalleSeleccionado.stock
              }
              className={`w-full flex items-center justify-center gap-3 bg-[#1c4577] text-white py-3 px-4 rounded-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed  ${detalleSeleccionado && detalleSeleccionado.stock > 0
                ? 'bg-[#1c4577] hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              <FaCartPlus size={18} />
              Agregar al carrito
            </button>


          </div>
        </div>

      </div>
    </div>
  );
};
{/*
                {cantidadEnCarrito > 0 && (
                  <button
                    onClick={handleQuitarDelCarrito}
                    className="text-red-600 font-semibold underline"
                  >
                    Quitar del carrito
                  </button>
                )}
            */}
export default DetalleScreen;