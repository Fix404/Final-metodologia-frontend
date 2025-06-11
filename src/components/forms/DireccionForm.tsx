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
      localidad: "",
      codigo_postal: 0,
    },
    provincia: "",
  });

  useEffect(() => {
    // Verificar si no tiene dirección para mostrar el formulario
    if (
      !usuario.direccion &&
      (!compraDireccionEnvio ||
        !compraDireccionEnvio.calle ||
        !compraDireccionEnvio.numero ||
        !compraDireccionEnvio.localidad?.localidad ||
        !compraDireccionEnvio.provincia)
    ) {
      setMostrarFormularioDireccion(true);
    }
  }, [usuario.direccion, compraDireccionEnvio]);

  const handleGuardarDireccion = () => {
    if (
      direccionTemporal.calle.trim() &&
      direccionTemporal.numero.trim() &&
      direccionTemporal.codigoPostal.trim() &&
      direccionTemporal.localidad.localidad.trim() &&
      direccionTemporal.provincia.trim() &&
      direccionTemporal.localidad.codigo_postal > 0
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
          localidad: "",
          codigo_postal: 0,
        },
        provincia: "",
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
        localidad: "",
        codigo_postal: 0,
      },
      provincia: "",
    });
    setMostrarFormularioDireccion(true);
  };

  const handleCodigoPostalChange = (value: string) => {
    const numericValue = parseInt(value) || 0;
    setDireccionTemporal({
      ...direccionTemporal,
      codigoPostal: value,
      localidad: {
        ...direccionTemporal.localidad,
        codigo_postal: numericValue,
      },
    });
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
                {usuario.direccion?.localidad?.localidad}, {usuario.direccion?.provincia}
                {usuario.direccion?.codigoPostal && ` - CP: ${usuario.direccion.codigoPostal}`}
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
              type="number"
              placeholder="Código Postal *"
              value={direccionTemporal.codigoPostal}
              onChange={(e) => handleCodigoPostalChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
            <input
              type="text"
              placeholder="Provincia *"
              value={direccionTemporal.provincia}
              onChange={(e) =>
                setDireccionTemporal({
                  ...direccionTemporal,
                  provincia: e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            <input
              type="text"
              placeholder="Localidad *"
              value={direccionTemporal.localidad.localidad}
              onChange={(e) =>
                setDireccionTemporal({
                  ...direccionTemporal,
                  localidad: {
                    ...direccionTemporal.localidad,
                    localidad: e.target.value,
                  },
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] md:col-span-1"
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
            compraDireccionEnvio.localidad.localidad &&
            compraDireccionEnvio.provincia ? (
              <p className="text-gray-700">
                {compraDireccionEnvio.calle} {compraDireccionEnvio.numero}
                <br />
                {compraDireccionEnvio.localidad.localidad}, {compraDireccionEnvio.provincia}
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