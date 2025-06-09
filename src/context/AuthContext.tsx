
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  rol: string[] | null;
  setRol: (rol: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [rol, setRol] = useState<string[] | null>(
    JSON.parse(localStorage.getItem("usuarioRol") || "null")
  );

  return (
    <AuthContext.Provider value={{ rol, setRol }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
