import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { MetodoPago } from "../../types/pago";
import { vaciarCarrito } from "../../redux/slices/CarritoSlice";
import { limpiarCompra } from "../../redux/slices/CompraSlice";

interface CompraExitosaProps {
  codigoPedido: string;
  metodoPago: MetodoPago;
  total: number;
  direccionEnvio: any;
}

export const CompraExitosa: React.FC<CompraExitosaProps> = ({
  codigoPedido,
  metodoPago,
  total,
  direccionEnvio
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Limpiar el carrito y los datos de compra cuando se monta este componente
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(vaciarCarrito());
      dispatch(limpiarCompra());
    }, 2000); // Esperar 2 segundos antes de limpiar para asegurar que se muestren los datos

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  const handleVolverAInicio = () => {
    // Asegurar limpieza antes de navegar
    dispatch(vaciarCarrito());
    dispatch(limpiarCompra());
    navigate("/");
  };

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Compra realizada con éxito!
          </h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-700 mb-2">
              Tu código de pedido es:
            </p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              {codigoPedido}
            </p>
            <p className="text-sm text-gray-600">
              Guarda este código para hacer seguimiento de tu pedido
            </p>
          </div>

          {metodoPago === "transferencia" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Debes realizar la transferencia para que podamos procesar tu pedido. 
                Una vez confirmado el pago, te enviaremos un email de confirmación.
              </p>
            </div>
          )}

          <div className="space-y-4 text-left mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Resumen del pedido:</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><strong>Total:</strong> ${total.toLocaleString()}</p>
              <p><strong>Método de pago:</strong> {metodoPago === "transferencia" ? "Transferencia bancaria" : "MercadoPago"}</p>
              <p><strong>Dirección de envío:</strong> {direccionEnvio?.calle} {direccionEnvio?.numero}, {direccionEnvio?.localidad?.nombre}</p>
            </div>
          </div>

          <button
            onClick={handleVolverAInicio}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};