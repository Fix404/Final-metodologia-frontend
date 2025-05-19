import { Link } from "react-router-dom";
import { LoginForm } from "../forms/LoginForm";


export const LoginScreen = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center bg-[#f0f4f9] px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#27548a] px-6 py-4">
            <h2 className="text-center text-2xl font-bold text-white">
             Log In
            </h2>
          </div>
          
          <div className="px-6 py-4">
            <LoginForm />
            
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