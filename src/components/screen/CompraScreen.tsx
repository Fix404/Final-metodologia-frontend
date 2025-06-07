import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CompraCard } from "../ui/CardList/CompraCard";
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";
import {
  setDni,
  setDireccionEnvio,
  setMetodoPago,
  procesarCompra,
  limpiarCompra,
} from "../../redux/slices/CompraSlice";
import { vaciarCarrito } from "../../redux/slices/CarritoSlice";
import { IUsuario } from "../../types/IUsuario";

export const CompraScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.carrito.items);
  // const usuario = useSelector((state: RootState) => state.auth.usuario);
  const compraState = useSelector((state: RootState) => state.compra);

  // USUARIO SIMULADO PARA TESTING - Remover cuando tengas auth real

  const usuario: IUsuario = {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@ejemplo.com",
    contrasenia: "123456",
  };

  const [mostrarFormularioDni, setMostrarFormularioDni] = useState(false);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] =
    useState(false);
  const [dniTemporal, setDniTemporal] = useState("");
  const [direccionTemporal, setDireccionTemporal] = useState({
    id: 0,
    calle: "",
    numero: "",
    codigoPostal: "",
    localidad: {
      id: 0,
      nombre: "",
      provincia: {
        id: 0,
        nombre: "",
      },
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/carrito");
      return;
    }

    if (!usuario.dni && !compraState.dni) {
      setMostrarFormularioDni(true);
    }

    if (
      !usuario.direccion &&
      (!compraState.direccionEnvio ||
        !compraState.direccionEnvio.calle ||
        !compraState.direccionEnvio.numero ||
        !compraState.direccionEnvio.localidad?.nombre ||
        !compraState.direccionEnvio.localidad?.provincia?.nombre)
    ) {
      setMostrarFormularioDireccion(true);
    }

    return () => {
      dispatch(limpiarCompra());
    };
  }, [usuario, items, navigate, dispatch]);

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

  const handleGuardarDni = () => {
    if (dniTemporal.trim().length >= 7) {
      dispatch(setDni(dniTemporal.trim()));
      setMostrarFormularioDni(false);
    } else {
      alert("El DNI debe tener al menos 7 dígitos.");
    }
  };

  const handleGuardarDireccion = () => {
    if (
      direccionTemporal.calle.trim() &&
      direccionTemporal.numero.trim() &&
      direccionTemporal.codigoPostal.trim() &&
      direccionTemporal.localidad.nombre.trim() &&
      direccionTemporal.localidad.provincia.nombre.trim()
    ) {
      dispatch(setDireccionEnvio(direccionTemporal));
      setMostrarFormularioDireccion(false);
    } else {
      alert("Todos los campos son obligatorios.");
    }
  };

  const handleUsarDireccionExistente = () => {
    if (usuario?.direccion) {
      dispatch(setDireccionEnvio(usuario.direccion));
      setMostrarFormularioDireccion(false);
    }
  };

  const handleSeleccionarMetodoPago = (
    metodo: "transferencia" | "mercadopago"
  ) => {
    dispatch(setMetodoPago(metodo));
  };

  const handleFinalizarCompra = async () => {
    try {
      // SIMULACIÓN DE COMPRA EXITOSA - Reemplazar con dispatch real
      console.log("Simulando compra exitosa con datos:", {
        usuario: usuario!,
        detalles: items.map((item) => ({
          ...item.detalle,
          cantidadComprada: item.cantidad,
        })),
        total: calcularTotal(),
        metodoPago: compraState.metodoPago,
        dni: compraState.dni || usuario?.dni,
        direccionEnvio: compraState.direccionEnvio || usuario?.direccion,
      });

      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular éxito
      dispatch(vaciarCarrito());
      alert("¡Compra procesada exitosamente! (simulación)");
      navigate("/carrito"); // Cambiar por "/compra-exitosa" cuando tengas esa ruta

      /* CÓDIGO REAL - Descomentar cuando tengas el backend
      const ordenCompra = {
        usuario: usuario!,
        detalles: items.map(item => ({
          ...item.detalle,
          cantidadComprada: item.cantidad
        })),
        total: calcularTotal(),
        metodoPago: compraState.metodoPago,
        dni: compraState.dni || usuario?.dni,
        direccionEnvio: compraState.direccionEnvio || usuario?.direccion
      };

      await dispatch(procesarCompra(ordenCompra));
      dispatch(vaciarCarrito());
      navigate("/compra-exitosa");
      */
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Error al procesar la compra (simulación)");
    }
  };

  const puedeFinalizarCompra = () => {
    return (
      !mostrarFormularioDni &&
      !mostrarFormularioDireccion &&
      compraState.metodoPago &&
      !compraState.procesando
    );
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
            {/* Información del usuario */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaUser className="text-[#4A90E2] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Datos del comprador
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {usuario.email}
                  </p>
                </div>

                <div>
                  {mostrarFormularioDni ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        DNI *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dniTemporal}
                          onChange={(e) => setDniTemporal(e.target.value)}
                          placeholder="Ingresa tu DNI"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                        />
                        <button
                          onClick={handleGuardarDni}
                          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] transition-colors"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      <strong>DNI:</strong>{" "}
                      {compraState.dni || usuario.dni || "No especificado"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-[#4A90E2] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Dirección de envío
                </h2>
              </div>

              {mostrarFormularioDireccion ? (
                <div className="space-y-4">
                  {usuario.direccion && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        ¿Usar tu dirección guardada?
                      </p>
                      <p className="text-gray-700">
                        {usuario.direccion?.calle} {usuario.direccion?.numero},{" "}
                        {usuario.direccion?.localidad?.nombre}
                      </p>
                      <button
                        onClick={handleUsarDireccionExistente}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
                      >
                        Usar esta dirección
                      </button>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Calle *"
                      value={direccionTemporal.calle}
                      onChange={(e) =>
                        setDireccionTemporal({
                          ...direccionTemporal,
                          calle: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      placeholder="Número *"
                      value={direccionTemporal.numero}
                      onChange={(e) =>
                        setDireccionTemporal({
                          ...direccionTemporal,
                          numero: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={direccionTemporal.codigoPostal}
                      onChange={(e) =>
                        setDireccionTemporal({
                          ...direccionTemporal,
                          codigoPostal: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      placeholder="Provincia *"
                      value={direccionTemporal.localidad.provincia.nombre}
                      onChange={(e) =>
                        setDireccionTemporal({
                          ...direccionTemporal,
                          localidad: {
                            ...direccionTemporal.localidad,
                            provincia: {
                              ...direccionTemporal.localidad.provincia,
                              nombre: e.target.value,
                            },
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    />

                    <input
                      type="text"
                      placeholder="Localidad *"
                      value={direccionTemporal.localidad.nombre}
                      onChange={(e) =>
                        setDireccionTemporal({
                          ...direccionTemporal,
                          localidad: {
                            ...direccionTemporal.localidad,
                            nombre: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                    />
                  </div>

                  <button
                    onClick={handleGuardarDireccion}
                    className="bg-[#4A90E2] text-white px-6 py-2 rounded-md hover:bg-[#357ABD] transition-colors"
                  >
                    Confirmar Dirección
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    {compraState.direccionEnvio &&
                    compraState.direccionEnvio.calle &&
                    compraState.direccionEnvio.numero &&
                    compraState.direccionEnvio.localidad &&
                    compraState.direccionEnvio.localidad.nombre &&
                    compraState.direccionEnvio.localidad.provincia &&
                    compraState.direccionEnvio.localidad.provincia.nombre ? (
                      <p className="text-gray-700">
                        {compraState.direccionEnvio.calle}{" "}
                        {compraState.direccionEnvio.numero}
                        <br />
                        {compraState.direccionEnvio.localidad.nombre},{" "}
                        {compraState.direccionEnvio.localidad.provincia.nombre}
                        {compraState.direccionEnvio.codigoPostal &&
                          ` - CP: ${compraState.direccionEnvio.codigoPostal}`}
                      </p>
                    ) : (
                      <p className="text-gray-500">
                        No hay dirección configurada
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setMostrarFormularioDireccion(true)}
                    className="text-[#4A90E2] hover:text-[#357ABD] text-sm font-medium"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaCreditCard className="text-[#4A90E2] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Método de pago
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={compraState.metodoPago === "transferencia"}
                    onChange={() =>
                      handleSeleccionarMetodoPago("transferencia")
                    }
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      Transferencia Bancaria
                    </p>
                    <p className="text-sm text-gray-600">
                      Te enviaremos los datos para realizar la transferencia
                    </p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="mercadopago"
                    checked={compraState.metodoPago === "mercadopago"}
                    onChange={() => handleSeleccionarMetodoPago("mercadopago")}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Mercado Pago</p>
                    <p className="text-sm text-gray-600">
                      Paga con tarjeta, efectivo o dinero en cuenta
                    </p>
                  </div>
                </label>
              </div>
            </div>
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
                {compraState.procesando ? "Procesando..." : "FINALIZAR COMPRA"}
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
