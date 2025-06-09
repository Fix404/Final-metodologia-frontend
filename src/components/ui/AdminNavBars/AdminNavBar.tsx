import { TiHome } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

export const AdminNavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-15 bg-[#183B4E] flex items-center justify-between text-white px-4">
      {/* Botón Home alineado a la izquierda */}
      <button
        onClick={() => navigate("/")}
        className="bg-red-500 hover:bg-red-400 text-white text-3xl font-semibold py-1 px-2 cursor-pointer rounded shadow-md transition"
      >
        <TiHome />
      </button>

      {/* Texto centrado */}
      <p className="text-3xl font-medium absolute left-1/2 transform -translate-x-1/2">
        ADMINISTRADOR
      </p>

      {/* Espacio a la derecha para mantener centrado el texto */}
      <div className="w-10" />
    </div>
  );
};
