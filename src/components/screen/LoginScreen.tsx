import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../forms/LoginForm";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../redux/slices/authSlice";


export const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usuario = useAppSelector(state => state.auth.usuario);

  if (usuario) {
    return (

      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow flex items-start justify-center bg-[#fcfcd3] px-4 pt-20">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-[#27548a] px-6 py-4">
              <h2 className="text-center text-2xl font-bold text-white">¡Ya estás logueado!</h2>
            </div>

            <div className="px-6 py-6 text-center">
              <p className="text-gray-700 text-lg mb-6">
                Estás logueado como <strong className="text-[#27548a]">{usuario.email}</strong>.<br />
                Si querés iniciar sesión con otra cuenta, primero cerrá sesión.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-4 py-2 bg-[#27548a] hover:bg-[#1e3e66] text-white font-medium rounded-md shadow-md transition-colors duration-200"
                >
                  Seguir comprando
                </button>

                <button
                  onClick={() => {
                    dispatch(logout());
                    localStorage.removeItem('authToken');
                    navigate("/login");
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-medium rounded-md shadow-md transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>


    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center bg-[#fcfcd3] px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#27548a] px-6 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
              Log In
            </h2>
          </div>

          <div className="px-6 py-4">
            <LoginForm />

         

            {/* Registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tenés una cuenta?{" "}
                <Link
                  to="/registro"
                  className="font-medium text-[#27548a] hover:text-[#1e3e66] transition-colors"
                >
                  Registrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

};