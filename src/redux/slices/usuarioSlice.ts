import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "../../services/usuarioService";

interface UsuarioState {
  usuarios: Usuario[];
  usuarioActivo: Usuario | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  usuarioActivo: null,
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    setUsuarioActivo: (state, action: PayloadAction<Usuario>) => {
      state.usuarioActivo = action.payload;
    },
    limpiarUsuarioActivo: (state) => {
      state.usuarioActivo = null;
    },
    setUsuarios: (state, action: PayloadAction<Usuario[]>) => {
      state.usuarios = action.payload;
    },
  },
});

export const {
  setUsuarioActivo,
  limpiarUsuarioActivo,
  setUsuarios,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;
