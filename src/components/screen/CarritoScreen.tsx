import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CarritoCard } from "../ui/CardList/CarritoCard";
import { FaShoppingBag } from "react-icons/fa";

export const CarritoScreen: React.FC = () => {
  const items = useSelector((state: RootState) => state.carrito.items);
  const navigate = useNavigate();

  const calcularPrecioFinal = (item: typeof items[number]["detalle"]) => {
    const precioBase = item.precio.precioVenta;
    const descuento = item.producto.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  const calcularTotal = () => {
    return items.reduce((total, { detalle, cantidad }) => {
      return total + calcularPrecioFinal(detalle) * cantidad;
    }, 0);
  };

  const handleComprar = () => {
    navigate("/shop");
  };

  const handleContinuarComprando = () => {
    navigate("/detalle");
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <FaShoppingBag className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Agrega algunos productos para continuar con tu compra
          </p>
          <button
            onClick={handleContinuarComprando}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">MI CARRITO</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {items.map(({ detalle, cantidad }) => (
            <CarritoCard key={detalle.id} detalle={detalle} cantidad={cantidad} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-semibold text-gray-800">TOTAL:</span>
              <span className="text-3xl font-bold text-gray-800">
                ${calcularTotal().toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleContinuarComprando}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300"
              >
                Continuar Comprando
              </button>

              <button
                onClick={handleComprar}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-3 px-8 rounded-lg transition-colors min-w-[160px]"
              >
                COMPRAR
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 gap-2">
              <span>Total de productos: {items.length}</span>
              <span>
                Total de artículos: {items.reduce((acc, item) => acc + item.cantidad, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
