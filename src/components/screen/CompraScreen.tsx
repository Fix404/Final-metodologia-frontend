import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CompraCard } from "../ui/CardList/CompraCard";
import { FaShieldAlt } from "react-icons/fa";
import { limpiarCompra } from "../../redux/slices/CompraSlice";
import { IUsuario } from "../../types/IUsuario";
import { DatosCompraForm } from "../forms/DatosCompraForm";
import { DireccionForm } from "../forms/DireccionForm";
import { useAppSelector } from "../../hooks/redux";
import { usuariosService } from "../../services/usuarioService";

export const CompraScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [datosUsuario, setDatosUsuario] = useState<IUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  const items = useSelector((state: RootState) => state.carrito.items);
  // Obtener el usuario del Redux store
  const usuario = useAppSelector((state) => state.auth.usuario);
  const compraState = useSelector((state: RootState) => state.compra);

  /* USUARIO SIMULADO PARA TESTING - Remover cuando tengas auth real
  const usuario: IUsuario = {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@ejemplo.com",
    contrasenia: "123456",
  };*/

  useEffect(() => {
    const fetchUserData = async () => {
      if (!usuario?.id) {
        setLoading(false);
        return;


      }

      try {
        const data = await usuariosService.obtenerUsuarioPorId(usuario.id);
        setDatosUsuario(data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [usuario?.id]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  console.log("DATOOOOSSSS:", "dni:", datosUsuario?.dni, "nombre:", datosUsuario?.nombre, "apellido:", datosUsuario?.apellido)

 // COMENTÉ ESTO DE ABAJO PORQUE SI NO, NO RENDERIZA. VER!!!!!!
 
  /*useEffect(() => {
    if (items.length === 0) {
      navigate("/carrito");
      return;
    }*/

    /*return () => {
      dispatch(limpiarCompra());
    };
  }, [items, navigate, dispatch]);*/

  const calcularPrecioFinal = (item: (typeof items)[number]["detalle"]) => {
    const precioBase = item.precio.precioVenta;
    const descuento = item.producto.descuento?.porcentaje ?? 0;
    return Math.round(precioBase * (1 - descuento / 100));
  };

  const calcularTotal = () => {
    return items.reduce((total, { detalle, cantidad }) => {
      return total + calcularPrecioFinal(detalle) * cantidad;
    }, 0);
  };

  const puedeFinalizarCompra = () => {
    // Verificar que tenga DNI (del usuario o del estado de compra)
    const tieneDni = datosUsuario?.dni || compraState.dni;

    // Verificar que tenga dirección completa
    const tieneDireccion =
      (datosUsuario?.direccion &&
        datosUsuario.direccion.calle &&
        datosUsuario.direccion.numero &&
        datosUsuario.direccion.localidad?.nombre &&
        datosUsuario.direccion.localidad?.provincia?.nombre) ||
      (compraState.direccionEnvio &&
        compraState.direccionEnvio.calle &&
        compraState.direccionEnvio.numero &&
        compraState.direccionEnvio.localidad?.nombre &&
        compraState.direccionEnvio.localidad?.provincia?.nombre);

    return tieneDni && tieneDireccion;
  };

  const handleFinalizarCompra = () => {
    if (puedeFinalizarCompra()) {
      navigate("/shop/pagar");
    }
  };

  if (!usuario) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Cargando usuario...</p>
          {/* Cuando tengas auth real, esto será: "Redirigiendo al login..." */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfae8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">FINALIZAR COMPRA</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos del comprador */}
            {datosUsuario && (
              <DatosCompraForm usuario={datosUsuario} compraDni={compraState.dni} />
            )}

            {/* Dirección de envío */}
            {datosUsuario && (
              <DireccionForm usuario={datosUsuario} compraDireccionEnvio={compraState.direccionEnvio} />
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
                    ${calcularTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${calcularTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-3">
                <FaShieldAlt className="text-green-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Compra 100% segura
                </span>
              </div>

              <button
                onClick={handleFinalizarCompra}
                disabled={!puedeFinalizarCompra()}
                className="w-full bg-[#4A90E2] hover:bg-[#357ABD] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                CONTINUAR CON EL PAGO
              </button>

              <button
                onClick={() => navigate("/carrito")}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Volver al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};