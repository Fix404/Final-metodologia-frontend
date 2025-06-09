import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CompraCard } from "../ui/CardList/CompraCard";
import { 
  FaCreditCard, 
  FaUniversity, 
  FaSpinner,
  FaShieldAlt,
  FaCopy,
  FaArrowLeft 
} from "react-icons/fa";
import { usePago } from "../../hooks/usePago";
import { datosTransferencia } from "../../constants/pagoConstant";
import { calcularTotal, copiarAlPortapapeles } from "../../utils/pagoUtils";
import { CompraExitosa } from "./CompraExitosaScreen";

export const PagoScreen: React.FC = () => {
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.carrito.items);
  const compraState = useSelector((state: RootState) => state.compra);
  
  const {
    metodoPago,
    setMetodoPago,
    procesandoPago,
    pagoCompletado,
    codigoPedido,
    handleFinalizarCompra
  } = usePago();

  useEffect(() => {
    // Verificar que venga de la pantalla anterior con datos completos
    if (items.length === 0 || !compraState.dni || !compraState.direccionEnvio) {
      navigate("/pagar");
      return;
    }
  }, [items, compraState, navigate]);

  const total = calcularTotal(items);

  if (pagoCompletado) {
    return (
      <CompraExitosa
        codigoPedido={codigoPedido}
        metodoPago={metodoPago!}
        total={total}
        direccionEnvio={compraState.direccionEnvio}
      />
    );
  }

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">MÉTODO DE PAGO</h1>
          <p className="text-gray-600 mt-2">Selecciona cómo quieres pagar tu pedido</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Métodos de pago */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selección de método de pago */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Elige tu método de pago
              </h2>

              <div className="space-y-4">
                {/* Transferencia Bancaria */}
                <div
                  onClick={() => setMetodoPago("transferencia")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    metodoPago === "transferencia"
                      ? "border-[#4A90E2] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <FaUniversity className="text-[#4A90E2] text-xl mr-4" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Transferencia Bancaria
                      </h3>
                      <p className="text-sm text-gray-600">
                        Realiza una transferencia desde tu banco
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      metodoPago === "transferencia"
                        ? "border-[#4A90E2] bg-[#4A90E2]"
                        : "border-gray-300"
                    }`}>
                      {metodoPago === "transferencia" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MercadoPago */}
                <div
                  onClick={() => setMetodoPago("mercadopago")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    metodoPago === "mercadopago"
                      ? "border-[#4A90E2] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <FaCreditCard className="text-[#4A90E2] text-xl mr-4" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        MercadoPago
                      </h3>
                      <p className="text-sm text-gray-600">
                        Paga con tarjeta, débito o crédito disponible
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      metodoPago === "mercadopago"
                        ? "border-[#4A90E2] bg-[#4A90E2]"
                        : "border-gray-300"
                    }`}>
                      {metodoPago === "mercadopago" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de transferencia */}
            {metodoPago === "transferencia" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Datos para transferencia
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Banco:</span>
                    <span className="font-medium">{datosTransferencia.banco}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Titular:</span>
                    <span className="font-medium">{datosTransferencia.titular}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">CBU:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">{datosTransferencia.cbu}</span>
                      <button
                        onClick={() => copiarAlPortapapeles(datosTransferencia.cbu)}
                        className="text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Alias:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono">{datosTransferencia.alias}</span>
                      <button
                        onClick={() => copiarAlPortapapeles(datosTransferencia.alias)}
                        className="text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Una vez realizada la transferencia, 
                    tu pedido será procesado y recibirás una confirmación por email. 
                    El tiempo de procesamiento es de 24-48 horas hábiles.
                  </p>
                </div>
              </div>
            )}

            {/* Información de MercadoPago */}
            {metodoPago === "mercadopago" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pago con MercadoPago
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <FaShieldAlt className="text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Pago 100% seguro</p>
                      <p className="text-sm text-gray-600">
                        Protegido por MercadoPago con garantía de devolución
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>• Acepta todas las tarjetas de crédito y débito</p>
                    <p>• Pago en cuotas disponible</p>
                    <p>• Procesamiento inmediato</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Resumen */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resumen del pedido
              </h3>

              <div className="space-y-3 mb-4">
                {items.map(({ detalle, cantidad }) => (
                  <CompraCard
                    key={detalle.id}
                    detalle={detalle}
                    cantidad={cantidad}
                  />
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                <button
                  onClick={handleFinalizarCompra}
                  disabled={!metodoPago || procesandoPago}
                  className="w-full bg-[#4A90E2] hover:bg-[#357ABD] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center"
                >
                  {procesandoPago ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    "FINALIZAR COMPRA"
                  )}
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Volver atrás
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};