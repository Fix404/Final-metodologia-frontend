import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IUsuario } from "../../types/IUsuario";

interface DireccionFormProps {
  usuario: IUsuario;
  compraDireccionEnvio: any;
  onDireccionChange: (direccion: any) => void;
  loading?: boolean;
}

export const CreateUsuarioDireccion: React.FC<DireccionFormProps> = ({
  usuario,
  compraDireccionEnvio,
  onDireccionChange,
  loading = false,
}) => {
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
      onDireccionChange(direccionTemporal);
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
      onDireccionChange(usuario.direccion);
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

  const handleEditarDireccion = () => {
    // Pre-llenar el formulario con la dirección actual
    if (compraDireccionEnvio) {
      setDireccionTemporal({
        id: compraDireccionEnvio.id || 0,
        calle: compraDireccionEnvio.calle || "",
        numero: compraDireccionEnvio.numero || "",
        codigoPostal: compraDireccionEnvio.codigoPostal || "",
        localidad: {
          id: compraDireccionEnvio.localidad?.id || 0,
          localidad: compraDireccionEnvio.localidad?.localidad || "",
          codigo_postal: compraDireccionEnvio.localidad?.codigo_postal || 0,
        },
        provincia: compraDireccionEnvio.provincia || "",
      });
    }
    setMostrarFormularioDireccion(true);
  };

  const handleEliminarDireccion = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar la dirección?")) {
      onDireccionChange(null);
      setMostrarFormularioDireccion(false);
    }
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
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
        Dirección
      </label>

      {mostrarFormularioDireccion ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-white space-y-4">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {compraDireccionEnvio ? 'Editar Dirección' : 'Nueva Dirección'}
          </div>

          {usuario.direccion && !compraDireccionEnvio && (
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
                type="button"
                onClick={handleUsarDireccionExistente}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
                disabled={loading}
              >
                Usar esta dirección
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
            
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
            
            <div>
              <input
                type="number"
                placeholder="Código Postal *"
                value={direccionTemporal.codigoPostal}
                onChange={(e) => handleCodigoPostalChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
            
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleGuardarDireccion}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              disabled={loading}
            >
              ✅ Confirmar Dirección
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioDireccion(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              disabled={loading}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          {compraDireccionEnvio &&
          compraDireccionEnvio.calle &&
          compraDireccionEnvio.numero &&
          compraDireccionEnvio.localidad &&
          compraDireccionEnvio.localidad.localidad &&
          compraDireccionEnvio.provincia ? (
            // Mostrar dirección guardada con opciones de editar/eliminar
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <p className="text-sm text-gray-800 font-medium">
                  {compraDireccionEnvio.calle} {compraDireccionEnvio.numero}
                </p>
                <p className="text-sm text-gray-600">
                  {compraDireccionEnvio.localidad.localidad}, {compraDireccionEnvio.provincia}
                </p>
                {compraDireccionEnvio.codigoPostal && (
                  <p className="text-sm text-gray-600">
                    CP: {compraDireccionEnvio.codigoPostal}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleEditarDireccion}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  disabled={loading}
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  onClick={handleEliminarDireccion}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  disabled={loading}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ) : (
            // Botón para agregar dirección
            <button
              type="button"
              onClick={() => setMostrarFormularioDireccion(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-left flex items-center justify-center"
              disabled={loading}
            >
              <span className="text-lg mr-2">📍</span>
              Agregar dirección
            </button>
          )}
        </div>
      )}
    </div>
  );
};