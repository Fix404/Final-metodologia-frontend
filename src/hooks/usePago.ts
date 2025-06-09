import { useState } from "react";
import { useDispatch } from "react-redux";
import { vaciarCarrito } from "../redux/slices/CarritoSlice";
import { limpiarCompra } from "../redux/slices/CompraSlice";
import { MetodoPago } from "../types/pago";
import { generarCodigoPedido } from "../utils/pagoUtils";

interface DatosPedido {
  items: any[];
  total: number;
  direccionEnvio: any;
}

export const usePago = () => {
  const dispatch = useDispatch();
  
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [codigoPedido, setCodigoPedido] = useState<string>("");

  const procesarPagoTransferencia = async () => {
    setProcesandoPago(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const codigo = generarCodigoPedido();
    setCodigoPedido(codigo);
    setProcesandoPago(false);
    setPagoCompletado(true);
    
    // No limpiar inmediatamente - dejar que el componente padre maneje cuándo limpiar
  };

  const procesarPagoMercadoPago = async () => {
    setProcesandoPago(true);
    
    // Simular integración con MercadoPago
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const codigo = generarCodigoPedido();
    setCodigoPedido(codigo);
    setProcesandoPago(false);
    setPagoCompletado(true);
    
    // No limpiar inmediatamente - dejar que el componente padre maneje cuándo limpiar
  };

  const handleFinalizarCompra = () => {
    if (!metodoPago) return;

    if (metodoPago === "transferencia") {
      procesarPagoTransferencia();
    } else {
      procesarPagoMercadoPago();
    }
  };

  const limpiarDatosPago = () => {
    dispatch(vaciarCarrito());
    dispatch(limpiarCompra());
  };

  return {
    metodoPago,
    setMetodoPago,
    procesandoPago,
    pagoCompletado,
    codigoPedido,
    handleFinalizarCompra,
    limpiarDatosPago
  };
};