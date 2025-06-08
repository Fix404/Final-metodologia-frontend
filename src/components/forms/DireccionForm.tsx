import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import { setDireccionEnvio } from "../../redux/slices/CompraSlice";
import { IUsuario } from "../../types/IUsuario";

interface DireccionFormProps {
  usuario: IUsuario;
  compraDireccionEnvio: any;
}

export const DireccionForm: React.FC<DireccionFormProps> = ({
  usuario,
  compraDireccionEnvio,
}) => {
  const dispatch = useDispatch();
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
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
    // Verificar si no tiene dirección para mostrar el formulario
    if (
      !usuario.direccion &&
      (!compraDireccionEnvio ||
        !compraDireccionEnvio.calle ||
        !compraDireccionEnvio.numero ||
        !compraDireccionEnvio.localidad?.nombre ||
        !compraDireccionEnvio.localidad?.provincia?.nombre)
    ) {
      setMostrarFormularioDireccion(true);
    }
  }, [usuario.direccion, compraDireccionEnvio]);

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
      // Limpiar el formulario
      setDireccionTemporal({
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

  const handleCambiarDireccion = () => {
    // Limpiar formulario y mostrar
    setDireccionTemporal({
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
    setMostrarFormularioDireccion(true);
  };

  return (
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
            {compraDireccionEnvio &&
            compraDireccionEnvio.calle &&
            compraDireccionEnvio.numero &&
            compraDireccionEnvio.localidad &&
            compraDireccionEnvio.localidad.nombre &&
            compraDireccionEnvio.localidad.provincia &&
            compraDireccionEnvio.localidad.provincia.nombre ? (
              <p className="text-gray-700">
                {compraDireccionEnvio.calle} {compraDireccionEnvio.numero}
                <br />
                {compraDireccionEnvio.localidad.nombre},{" "}
                {compraDireccionEnvio.localidad.provincia.nombre}
                {compraDireccionEnvio.codigoPostal &&
                  ` - CP: ${compraDireccionEnvio.codigoPostal}`}
              </p>
            ) : (
              <p className="text-gray-500">No hay dirección configurada</p>
            )}
          </div>
          <button
            onClick={() => handleCambiarDireccion()}
            className="text-[#4A90E2] hover:text-[#357ABD] text-sm font-medium"
          >
            Cambiar
          </button>
        </div>
      )}
    </div>
  );
};