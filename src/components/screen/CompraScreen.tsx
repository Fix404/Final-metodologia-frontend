import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { CompraCard } from "../ui/CardList/CompraCard";
import { FaShieldAlt } from "react-icons/fa";
import { IUsuario } from "../../types/IUsuario";
import { IDireccion} from "../../types/IDireccion";
import {ILocalidad } from "../../types/ILocalidad";
import { DatosCompraForm } from "../forms/DatosCompraForm";
import { DireccionForm } from "../forms/DireccionForm";
import { useAppSelector } from "../../hooks/redux";
import { usuariosService } from "../../services/usuarioService";
import { direccionService } from "../../services/direccionService";
import { localidadService } from "../../services/localidadService";

export const CompraScreen: React.FC = () => {
  const navigate = useNavigate();
  const [datosUsuario, setDatosUsuario] = useState<IUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesandoCompra, setProcesandoCompra] = useState(false);

  const items = useSelector((state: RootState) => state.carrito.items);
  const usuario = useAppSelector((state) => state.auth.usuario);
  const compraState = useSelector((state: RootState) => state.compra);

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
    const tieneDni = datosUsuario?.dni || compraState.dni;
    const tieneDireccion =
      (datosUsuario?.direccion &&
        datosUsuario.direccion.calle &&
        datosUsuario.direccion.numero &&
        datosUsuario.direccion.localidad?.localidad &&
        datosUsuario.direccion.provincia) ||
      (compraState.direccionEnvio &&
        compraState.direccionEnvio.calle &&
        compraState.direccionEnvio.numero &&
        compraState.direccionEnvio.localidad?.localidad &&
        compraState.direccionEnvio.provincia);

    return tieneDni && tieneDireccion;
  };

  const handleFinalizarCompra = async () => {
    if (!puedeFinalizarCompra() || !usuario?.id || !datosUsuario) {
      return;
    }

    setProcesandoCompra(true);

    try {
      let direccionId: number | null = null;

      // 1. Verificar si necesitamos crear una nueva dirección
      if (compraState.direccionEnvio) {
        if (compraState.direccionEnvio.id === 0 || !compraState.direccionEnvio.id) {
          console.log("Procesando nueva dirección...");
          
          let localidadId: number | null = null;
          
          // 1.1. Verificar si la localidad existe o crearla
          if (compraState.direccionEnvio.localidad) {
            try {
              const localidadesExistentes = await localidadService.buscarLocalidad(
                compraState.direccionEnvio.localidad.localidad,
                compraState.direccionEnvio.localidad.codigo_postal
              );
              
              if (localidadesExistentes && localidadesExistentes.length > 0) {
                localidadId = localidadesExistentes[0].id;
                console.log("Usando localidad existente con ID:", localidadId);
              } else {
                console.log("Creando nueva localidad...");
                const nuevaLocalidad: Omit<ILocalidad, 'id'> = {
                  localidad: compraState.direccionEnvio.localidad.localidad,
                  codigo_postal: compraState.direccionEnvio.localidad.codigo_postal
                };
                
                const localidadCreada = await localidadService.crearLocalidad(nuevaLocalidad);
                localidadId = localidadCreada.id;
                console.log("Localidad creada con ID:", localidadId);
              }
            } catch (error) {
              console.error("Error al buscar localidad, creando nueva:", error);
              const nuevaLocalidad: Omit<ILocalidad, 'id'> = {
                localidad: compraState.direccionEnvio.localidad.localidad,
                codigo_postal: compraState.direccionEnvio.localidad.codigo_postal
              };
              
              const localidadCreada = await localidadService.crearLocalidad(nuevaLocalidad);
              localidadId = localidadCreada.id;
              console.log("Localidad creada con ID:", localidadId);
            }
          }

          // 1.2. Crear la dirección con la localidad
          if (localidadId) {
            console.log("Creando nueva dirección...");
            const nuevaDireccion: Omit<IDireccion, 'id'> = {
              calle: compraState.direccionEnvio.calle,
              numero: compraState.direccionEnvio.numero,
              codigoPostal: compraState.direccionEnvio.codigoPostal,
              localidad: { 
                id: localidadId,
                localidad: compraState.direccionEnvio.localidad.localidad,
                codigo_postal: compraState.direccionEnvio.localidad.codigo_postal
              },
              provincia: compraState.direccionEnvio.provincia
            };

            const direccionCreada = await direccionService.crearDireccion(nuevaDireccion);
            direccionId = direccionCreada.id;
            console.log("Dirección creada con ID:", direccionId);
          }
        } else {
          direccionId = compraState.direccionEnvio.id;
        }
      } else if (datosUsuario.direccion?.id) {
        direccionId = datosUsuario.direccion.id;
      }

      // 2. Actualizar el usuario con DNI y dirección
      const updatedUser: IUsuario = {
        id: datosUsuario.id,
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        contrasenia: datosUsuario.contrasenia,
        dni: compraState.dni ?? datosUsuario.dni,
        direccion: direccionId ? { id: direccionId } as IDireccion : null,
        rol: datosUsuario.rol,
        activo: datosUsuario.activo
      };

      console.log("Actualizando usuario con datos:", updatedUser);
      
      await usuariosService.actualizarUsuario(usuario.id, updatedUser);
      console.log("Usuario actualizado exitosamente");
      
      setDatosUsuario(prev => prev ? {
        ...prev,
        dni: updatedUser.dni,
        direccion: updatedUser.direccion
      } : null);
      
      navigate("/pagar");
      
    } catch (err: any) {
      console.error("Error en el proceso de finalizar compra:", err);
      
      if (err.response) {
        console.error("Error response:", err.response.data);
        console.error("Status:", err.response.status);
        
        if (err.response.status === 403) {
          alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
          return;
        }
        
        if (err.response.status === 400) {
          alert("Error en los datos enviados. Verifica la información.");
          return;
        }
      }
      
      alert("Error al procesar la compra. Inténtalo de nuevo.");
    } finally {
      setProcesandoCompra(false);
    }
  };

  if (!usuario) {
    return (
      <div className="bg-[#fdfae8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Cargando usuario...</p>
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
          {/*Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {datosUsuario && (
              <DatosCompraForm usuario={datosUsuario} compraDni={compraState.dni} />
            )}

            {datosUsuario && (
              <DireccionForm usuario={datosUsuario} compraDireccionEnvio={compraState.direccionEnvio} />
            )}
          </div>

          {/*Resumen */}
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
                disabled={!puedeFinalizarCompra() || procesandoCompra}
                className="w-full bg-[#4A90E2] hover:bg-[#357ABD] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                {procesandoCompra ? 'PROCESANDO...' : 'CONTINUAR CON EL PAGO'}
              </button>

              <button
                onClick={() => navigate("/carrito")}
                disabled={procesandoCompra}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
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