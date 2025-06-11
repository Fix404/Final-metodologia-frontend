import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import { IDetalle } from '../../types/IDetalle';
import { ITalle } from '../../types/ITalle';
import { IColor } from '../../types/IColor';
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito } from '../../redux/slices/CarritoSlice';
import { descontarStock } from '../../redux/slices/detalleProductoSlice';
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
    if (cantidadEnCarrito >= detalleSeleccionado.stock!) return;

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
    <div className="bg-[#fcfcd3] min-h-screen py-8 max-xs:py-4 px-4 flex flex-col items-center justify-start">
      <div className="max-w-6xl w-full max-sx:pb-20">
        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8 max-xs:gap-6 h-[400px] lg:h-[500px] max-sm:h-auto">
          
          {/* Imagen */}
          <div className="w-full lg:w-1/2 h-full max-sx:h-auto">
            <div className="w-full h-full max-xs:aspect-square max-sm:max-w-sm max-sm:mx-auto rounded-lg shadow-sm overflow-hidden">
              <img
                src={producto?.imagen?.url}
                alt={producto?.imagen?.altDescripcion}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/*Info */}
          <div className="w-full lg:w-1/2 h-full max-sm:h-auto flex flex-col justify-between max-sm:justify-start pl-0 lg:pl-5">
            
            {/* Info del producto */}
            <div className="space-y-6 max-sx:space-y-4 flex-1 max-xs:flex-none">
              <div>
                <h1 className="text-3xl max-xs:text-2xl font-bold text-gray-800 max-sm:text-center">
                  {producto?.nombre.toUpperCase()}
                </h1>
                <p className="text-lg max-xs:text-base text-gray-600 mt-2 max-sm:text-center max-sm:px-2">
                  {producto?.descripcion}
                </p>
              </div>

              {/* Colores */}
              <div className="max-sm:text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Color</h3>
                <div className="flex gap-2 max-sm:justify-center max-sm:flex-wrap">
                  {getColoresDisponibles().map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color.color)}
                      style={{ backgroundColor: getColorHex(color.color) }}
                      className={`w-12 h-12 max-xs:w-10 max-xs:h-10 rounded-full border-4 transition-all ${
                        selectedColor === color.color
                          ? 'border-gray-600 scale-110 hover:cursor-pointer'
                          : 'border-gray-300 hover:border-gray-400 hover:cursor-pointer'
                      }`}
                      title={color.color}
                    />
                  ))}
                </div>
              </div>

              {/* Talles */}
              <div className="max-sm:text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Talle</h3>
                <div className="flex gap-3 max-sm:justify-center max-sm:flex-wrap max-sm:gap-2">
                  {getTallesDisponibles().map((talle, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTalle(talle.talle)}
                      className={`h-11 w-11 max-sm:h-10 max-sm:w-10 px-3 py-1 rounded-md text-lg max-sm:text-base font-semibold transition-all ${
                        selectedTalle === talle.talle
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

            {/* Información de compra */}
            <div className="space-y-4 mt-6 max-sm:mt-8 max-sm:space-y-6">
              <div className="flex justify-between items-center max-sm:flex-col max-sm:items-center max-sm:gap-4 max-sm:text-center">
                
                {/* Stock */}
                <div className="flex flex-col max-sm:items-center">
                  <span className="font-semibold text-xl max-sm:text-lg text-gray-700">
                    En carrito: {cantidadEnCarrito}
                  </span>
                  <span className="font-semibold max-sm:text-base text-gray-700">
                    Stock disponible: {detalleSeleccionado?.stock != null
                      ? detalleSeleccionado.stock - cantidadEnCarrito
                      : 0}
                  </span>
                </div>

                {/* Precio */}
                {detalleSeleccionado && detalleSeleccionado.stock! > 0 && (
                  <div className="flex items-center gap-4 max-sm:flex-col max-sm:gap-2">
                    {producto?.descuento?.porcentaje ? (
                      <div className="flex items-center gap-2 max-sm:flex-row max-sm:gap-1">
                        <span className="text-gray-500 line-through font-semibold text-xl max-sm:text-lg">
                          ${detalleSeleccionado.precio?.precioVenta}
                        </span>
                        <span className="text-green-600 text-xl max-sm:text-lg font-semibold">
                          -{producto.descuento.porcentaje}%
                        </span>
                        <span className="text-black font-bold text-3xl max-sm:text-2xl">
                          ${calculateFinalPrice(detalleSeleccionado)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-bold text-2xl max-sm:text-xl">
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
                  cantidadEnCarrito >= detalleSeleccionado.stock!
                }
                className={`w-full max-sm:max-w-sm max-sm:mx-auto flex items-center justify-center gap-3 text-white py-4 px-4 max-sm:py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer ${
                  detalleSeleccionado && detalleSeleccionado.stock! > 0
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
    </div>
  );
};

export default DetalleScreen;