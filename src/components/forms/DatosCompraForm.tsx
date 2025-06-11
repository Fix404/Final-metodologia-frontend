import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import { setDni } from "../../redux/slices/CompraSlice";
import { IUsuario } from "../../types/IUsuario";

interface DatosCompraFormProps {
  usuario: IUsuario;
  compraDni: number | null;
}

export const DatosCompraForm: React.FC<DatosCompraFormProps> = ({
  usuario,
  compraDni,
}) => {
  const dispatch = useDispatch();
  const [dniTemporal, setDniTemporal] = useState("");
  const [mostrarFormularioDni, setMostrarFormularioDni] = useState(false);

  useEffect(() => {
    // Verificar si no tiene DNI para mostrar el formulario
    if (!usuario.dni && !compraDni) {
      setMostrarFormularioDni(true);
    }
  }, [usuario.dni, compraDni]);

  const handleGuardarDni = () => {
    if (dniTemporal.trim().length >= 7) {
      dispatch(setDni(Number(dniTemporal.trim())));
      setMostrarFormularioDni(false);
      setDniTemporal("");
    } else {
      alert("El DNI debe tener al menos 7 dígitos.");
    }
  };

  return (
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
              {compraDni || usuario.dni || "No especificado"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};