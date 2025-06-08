import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import { IDetalle } from '../../types/IDetalle';
import { ITalle } from '../../types/ITalle';
import { IColor } from '../../types/IColor';
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito, quitarDelCarrito } from '../../redux/slices/CarritoSlice';
import { descontarStock, restaurarStock } from '../../redux/slices/detalleProductoSlice';
import { RootState } from '../../redux/store';

const fetchDetallesByProductoId = async (productoId: string): Promise<IDetalle[]> => {
  try {
    const response = await fetch(`http://localhost:8080/detalle/productos/${productoId}`);
    if (!response.ok) {
      throw new Error('Error al obtener los detalles del producto');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching detalles:', error);
    throw error;
  }
};


const DetalleScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [detalles, setDetalles] = useState<IDetalle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedTalle, setSelectedTalle] = useState<string | null>(null);

  const dispatch = useDispatch();
  const carritoItems = useSelector((state: RootState) => state.carrito.items);

  useEffect(() => {
    const loadDetalles = async () => {
      if (!id) {
        setError('ID de producto requerido');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const detallesData = await fetchDetallesByProductoId(id);

        if (!Array.isArray(detallesData) || detallesData.length === 0) {
          setError('No se encontraron detalles para este producto');
          setDetalles([]);
        } else {
          setDetalles(detallesData);
        }
      } catch (err) {
        setError('Error al cargar los detalles del producto');
        console.error('Error loading detalles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetalles();
  }, [id]);

  useEffect(() => {
    if (detalles.length > 0) {
      const coloresDisponibles = getColoresDisponibles();
      const tallesDisponibles = getTallesDisponibles();

      if (coloresDisponibles.length > 0 && !selectedColor) {
        setSelectedColor(coloresDisponibles[0].color);
      }
      if (tallesDisponibles.length > 0 && !selectedTalle) {
        setSelectedTalle(tallesDisponibles[0].talle);
      }
    }
  }, [detalles, selectedColor, selectedTalle]);

  const getColoresDisponibles = (): IColor[] => {
    if (!Array.isArray(detalles) || detalles.length === 0) return [];
    return Array.from(
      new Map(detalles.map(d => [d.color.color, d.color])).values()
    );
  };


  const getTallesDisponibles = (): ITalle[] => {
    if (!Array.isArray(detalles) || detalles.length === 0) return [];
    return Array.from(
      new Map(detalles.map(d => [d.talle.talle, d.talle])).values()
    );
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Blanco': '#FFFFFF', 'Negro': '#000000', 'Rojo': '#FF0000',
      'Azul': '#0000FF', 'Verde': '#008000', 'Rosa': '#FFC0CB',
      'Gris': '#808080', 'Amarillo': '#FFFF00', 'Naranja': '#FFA500',
      'Marrón': '#8B4513'
    };
    return colorMap[colorName] || '#CCCCCC';
  };


  const calculateFinalPrice = (detalle: IDetalle): number => {
    const base = detalle.precio?.precioVenta || 0;
    const descuento = detalle.producto?.descuento?.porcentaje ?? 0;
    return Math.round(base * (1 - descuento / 100));
  };


  const producto = detalles.length > 0 ? detalles[0]?.producto : null;
  const detalleSeleccionado = Array.isArray(detalles) ? detalles.find(
    d => d.color.color === selectedColor && d.talle.talle === selectedTalle
  ) : null;
  const cantidadEnCarrito = carritoItems.find(
    item => item.detalle.id === detalleSeleccionado?.id
  )?.cantidad || 0;

  const handleAgregarAlCarrito = () => {
    if (!detalleSeleccionado || detalleSeleccionado.stock === 0) return;
    if (cantidadEnCarrito >= detalleSeleccionado.stock) return;

    dispatch(agregarAlCarrito(detalleSeleccionado));
    dispatch(descontarStock(detalleSeleccionado.id));
  };


  if (loading) {
    return (
      <div className="bg-[#fdfae8] min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4577] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#fdfae8] min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1c4577] text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (detalles.length === 0) {
    return (
      <div className="bg-[#fdfae8] min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el detalle del producto</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcd3] min-h-screen py-8 px-4 flex flex-col items-center justify-start">
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
            <h1 className="text-3xl font-bold text-gray-800">{producto?.nombre.toUpperCase()}</h1>
            <p className="text-lg text-gray-600">{producto?.descripcion}</p>

            {/* Colores */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Color</h3>
              <div className="flex gap-2 mt-1">
                {getColoresDisponibles().map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.color)}
                    style={{ backgroundColor: getColorHex(color.color) }}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor === color.color
                      ? 'border-gray-600 scale-110 hover:cursor-pointer'
                      : 'border-gray-300 hover:border-gray-400 hover:cursor-pointer'
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
                {getTallesDisponibles().map((talle, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTalle(talle.talle)}
                    className={`h-11 w-11 px-3 py-1 rounded-md text-1x2 font-semibold transition-all ${selectedTalle === talle.talle
                      ? 'bg-[#1c4577] hover:cursor-pointer text-white'
                      : 'bg-gray-300 hover:bg-gray-400 hover:cursor-pointer text-gray-700'
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

            <div className="flex justify-between items-center">
              {/* Stock */}
              <span className="font-semibold text-xl text-gray-700">
                En carrito: {cantidadEnCarrito}
              </span>

              {/* Precio */}
              {detalleSeleccionado && detalleSeleccionado.stock > 0 && (
                <div className="flex items-center gap-4">
                  {producto?.descuento?.porcentaje ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 line-through font-semibold text-xl">
                        ${detalleSeleccionado.precio?.precioVenta}
                      </span>
                      <span className="text-green-600 text-xl font-semibold">
                        -{producto.descuento.porcentaje}%
                      </span>
                      <span className="text-black font-bold text-3xl">
                        ${calculateFinalPrice(detalleSeleccionado)}
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


            {/* Botón agregar al carrito */}
            <button
              onClick={handleAgregarAlCarrito}
              disabled={
                !detalleSeleccionado ||
                detalleSeleccionado.stock === 0 ||
                cantidadEnCarrito >= detalleSeleccionado.stock
              }
              className={`w-full flex items-center justify-center gap-3 text-white py-3 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer ${detalleSeleccionado && detalleSeleccionado.stock > 0
                ? 'bg-[#1c4577] hover:bg-blue-900'
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


export default DetalleScreen;
