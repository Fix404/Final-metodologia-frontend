// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  usuario: {
    id: number;
    nombre: string, 
  apellido: null,
    email: string;
    } | null;
  rol: string[] | null;
}

const initialState: AuthState = {
  usuario: JSON.parse(localStorage.getItem("usuario") || "null"),
  rol: JSON.parse(localStorage.getItem("usuarioRol") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsuario: (state, action: PayloadAction<AuthState["usuario"]>) => {
      state.usuario = action.payload;
      localStorage.setItem("usuario", JSON.stringify(action.payload));
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.rol = action.payload;
      localStorage.setItem("usuarioRol", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.usuario = null;
      state.rol = null;
      localStorage.removeItem("usuario");
      localStorage.removeItem("usuarioRol");
    },
  },
});

export const { setUsuario, setRoles, logout } = authSlice.actions;
export default authSlice.reducer;
