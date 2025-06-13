import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vaciarCarrito } from "../redux/slices/CarritoSlice";
import {
  limpiarCompra,
  establecerOrdenGenerada,
} from "../redux/slices/CompraSlice";
import { MetodoPago } from "../types/pago";
import { generarCodigoPedido, calcularTotal } from "../utils/pagoUtils";
import { ordenesCompraService } from "../services/ordenesCompraService";
import { productoCantidadService } from "../services/productoCantidadService";
import { IOrdenCompra } from "../types/IOrdenCompra";
import { IProductoCantidad } from "../types/IProductoCantidad";
import { RootState } from "../redux/store";
import { useAppSelector } from "./redux";
import { IDetalle } from "../types/IDetalle";

export const usePago = () => {
  const dispatch = useDispatch();

  // Estados para obtener datos necesarios
  const items = useSelector((state: RootState) => state.carrito.items);
  const usuario = useAppSelector((state) => state.auth.usuario);
  const compraState = useSelector((state: RootState) => state.compra);

  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [codigoPedido, setCodigoPedido] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /*const calcularTotal = () => {
    return items.reduce((total, { detalle, cantidad }) => {
      const precioBase = detalle.precio.precioVenta;
      const descuento = detalle.producto.descuento?.porcentaje ?? 0;
      const precioFinal = Math.round(precioBase * (1 - descuento / 100));
      return total + precioFinal * cantidad;
    }, 0);
  };*/

  // CORRECTO
  const crearOObtenerProductoCantidad = async (
    detalle: IDetalle,
    cantidad: number
  ): Promise<number | null> => {
    try {
      // Intentar buscar si ya existe
      const existentes =
        await productoCantidadService.buscarPorDetalleYCantidad(
          detalle.id,
          cantidad
        );

      if (existentes && existentes.length > 0) {
        return existentes[0].id;
      }

      // Si no existe, crear uno nuevo
      const nuevoProductoCantidad =
        await productoCantidadService.crearProductoCantidad({
          detalle: detalle,
          cantidad: cantidad,
        });

      return nuevoProductoCantidad.id;
    } catch (error) {
      console.error(
        `Error al crear/obtener ProductoCantidad para detalle ${detalle.id}:`,
        error
      );
      return null;
    }
  };

  const crearOrdenCompra = async (): Promise<IOrdenCompra | null> => {
    if (!usuario?.id) {
      setError("Usuario no encontrado");
      return null;
    }

    try {
      // Crear o obtener ProductoCantidad para cada item del carrito
      const listaProductoCantidad: IProductoCantidad[] = [];

      for (const { detalle, cantidad } of items) {
        const productoCantidadId = await crearOObtenerProductoCantidad(
          detalle,
          cantidad
        );

        if (productoCantidadId === null) {
          throw new Error(
            `Error al procesar producto: ${detalle.producto?.nombre}`
          );
        }

        listaProductoCantidad.push({
          id: productoCantidadId,
          detalle,
          cantidad,
        });
      }
      const total = calcularTotal(items);
      
      // Crear la orden de compra
      // CORRECTO
      const ordenCompra: Omit<IOrdenCompra, "id"> = {
        fecha: new Date().toISOString(),
        precioTotal: total,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre || "", // Valor por defecto ya que usuario.nombre puede no existir
          apellido: usuario.apellido || "", // Usuario del auth no tiene apellido
          email: usuario.email,
          contrasenia: "",
          activo: true,
        },
        movimiento: "ENVIO",
        productoCantidad: listaProductoCantidad,
        activo: true,
      };

      console.log("Creando orden de compra:", ordenCompra);

      const response = await ordenesCompraService.crearOrdenCompra(
        ordenCompra as IOrdenCompra
      );
      console.log("Orden de compra creada exitosamente:", response);

      return response;
    } catch (error: any) {
      console.error("Error al crear orden de compra:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status:", error.response.status);

        if (error.response.status === 403) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
        } else if (error.response.status === 400) {
          setError("Error en los datos de la orden. Verifica la información.");
        } else if (error.response.status === 500) {
          setError("Error interno del servidor. Inténtalo más tarde.");
        } else {
          setError("Error al procesar la orden de compra.");
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }

      return null;
    }
  };

  const procesarPagoTransferencia = async () => {
    setProcesandoPago(true);
    setError(null);

    try {
      // Crear la orden de compra en la base de datos
      const ordenCreada = await crearOrdenCompra();

      if (!ordenCreada) {
        setProcesandoPago(false);
        return;
      }

      // Guardar la orden en el estado para mostrar en CompraExitosa
      dispatch(establecerOrdenGenerada(ordenCreada));

      // Simular procesamiento de transferencia
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const codigo = generarCodigoPedido();
      setCodigoPedido(codigo);
      setProcesandoPago(false);
      setPagoCompletado(true);
    } catch (error) {
      console.error("Error en procesamiento de transferencia:", error);
      setError("Error al procesar el pago por transferencia.");
      setProcesandoPago(false);
    }
  };

  const procesarPagoMercadoPago = async () => {
    setProcesandoPago(true);
    setError(null);

    try {
      // Crear la orden de compra en la base de datos
      const ordenCreada = await crearOrdenCompra();

      if (!ordenCreada) {
        setProcesandoPago(false);
        return;
      }

      // Guardar la orden en el estado para mostrar en CompraExitosa
      dispatch(establecerOrdenGenerada(ordenCreada));

      // Simular integración con MercadoPago
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const codigo = generarCodigoPedido();
      setCodigoPedido(codigo);
      setProcesandoPago(false);
      setPagoCompletado(true);
    } catch (error) {
      console.error("Error en procesamiento de MercadoPago:", error);
      setError("Error al procesar el pago con MercadoPago.");
      setProcesandoPago(false);
    }
  };

  const handleFinalizarCompra = () => {
    if (!metodoPago) {
      setError("Selecciona un método de pago");
      return;
    }

    if (items.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    if (!usuario?.id) {
      setError("Usuario no encontrado. Inicia sesión nuevamente.");
      return;
    }

    if (metodoPago === "transferencia") {
      procesarPagoTransferencia();
    } else {
      procesarPagoMercadoPago();
    }
  };

  const limpiarDatosPago = () => {
    dispatch(vaciarCarrito());
    dispatch(limpiarCompra());
    setError(null);
  };

  const limpiarError = () => {
    setError(null);
  };

  return {
    metodoPago,
    setMetodoPago,
    procesandoPago,
    pagoCompletado,
    codigoPedido,
    error,
    handleFinalizarCompra,
    limpiarDatosPago,
    limpiarError,
  };
};
