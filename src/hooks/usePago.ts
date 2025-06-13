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
import axios from "axios";

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

  // CORRECTO
  // CORREGIDO - Busca por detalle primero, luego filtra por cantidad
  const crearOObtenerProductoCantidad = async (
    detalle: IDetalle,
    cantidad: number
  ): Promise<number | null> => {
    try {
      console.log(`Buscando ProductoCantidad para detalle ID: ${detalle.id}, cantidad: ${cantidad}`);
      
      // Primero buscar todos los ProductoCantidad con el mismo detalle_id
      const productosConMismoDetalle = await productoCantidadService.buscarPorDetalle(detalle.id);
      
      console.log(`Se encontraron ${productosConMismoDetalle?.length || 0} ProductoCantidad con detalle ID: ${detalle.id}`);
      
      // Si hay productos con el mismo detalle, buscar si alguno tiene la cantidad exacta
      if (productosConMismoDetalle && productosConMismoDetalle.length > 0) {
        const productoConCantidadExacta = productosConMismoDetalle.find(
          (pc: IProductoCantidad) => pc.cantidad === cantidad
        );
        
        if (productoConCantidadExacta) {
          console.log(`ProductoCantidad existente encontrado con ID: ${productoConCantidadExacta.id}`);
          return productoConCantidadExacta.id;
        }
      }

      console.log(`No se encontró ProductoCantidad existente, creando nuevo para detalle ${detalle.id} con cantidad ${cantidad}`);
      const dataToSend = {
        detalle: detalle,
        cantidad: cantidad,
      };
      console.log('Datos que se enviarán para crear ProductoCantidad:', JSON.stringify(dataToSend, null, 2));
      // Si no existe, crear uno nuevo
      const nuevoProductoCantidad = await productoCantidadService.crearProductoCantidad({
        detalle: detalle,
        cantidad: cantidad,
      });

      console.log(`Nuevo ProductoCantidad creado con ID: ${nuevoProductoCantidad.id}`);
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


  const procesarPagoTransferencia = async (ordenCompra: IOrdenCompra) => {
    setProcesandoPago(true);
    setError(null);

    try {
      // Guardar la orden en el estado para mostrar en CompraExitosa
      dispatch(establecerOrdenGenerada(ordenCompra));

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

  const generarPago = async (usuarioId: number, carrito: IProductoCantidad[]) => {
    try {
      const response = await axios.post("http://localhost:8080/pay/mp", {
        usuarioId,
        carrito
      });

      console.log("Respuesta del backend:", response.data);
      return response.data.urlPago;

    } catch (error) {
      console.error("Error al generar el pago:", error);
      return null;
    }
  };

  
  const procesarPagoMercadoPago = async (ordenCompra: IOrdenCompra) => {
    setProcesandoPago(true);
    setError(null);

    try {
      // Guardar la orden en el estado para mostrar en CompraExitosa
      dispatch(establecerOrdenGenerada(ordenCompra));

      const carrito: IProductoCantidad[] = items.map(({ detalle, cantidad }) => ({
        id: 0,
        detalle,
        cantidad
      }));

      const urlPago = await generarPago(usuario?.id!, carrito);
      if (urlPago) {
        console.log("Redirigiendo a MercadoPago:", urlPago);
        window.location.href = urlPago;
      } else {
        throw new Error("Error al generar el pago con MercadoPago.");
      }

    } catch (error) {
      console.error("Error en procesamiento de MercadoPago:", error);
      setError("Error al procesar el pago con MercadoPago.");
    } finally {
      setProcesandoPago(false);
    }
  };


  const handleFinalizarCompra = async () => {
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

    setProcesandoPago(true);
    setError(null);

    try {
      
      const ordenCreada = await crearOrdenCompra();
      if (!ordenCreada) {
        setProcesandoPago(false);
        return;
      }

      if (metodoPago === "transferencia") {
        await procesarPagoTransferencia(ordenCreada);
        dispatch(vaciarCarrito());
        dispatch(limpiarCompra());
        setPagoCompletado(true);
      } else if (metodoPago === "mercadopago") {
        await procesarPagoMercadoPago(ordenCreada);
        // Para MercadoPago, el carrito se limpia después de la confirmación del pago
      }

    } catch (error) {
      console.error("Error en el proceso de compra:", error);
      setError("Error al procesar el pago.");
    } finally {
      setProcesandoPago(false);
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