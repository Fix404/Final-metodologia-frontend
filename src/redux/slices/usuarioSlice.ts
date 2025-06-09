import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUsuario } from "../../types/IUsuario";

interface UsuarioState {
  usuarios: IUsuario[];
  usuarioActivo: IUsuario | null;
}

const initialState: UsuarioState = {
  usuarios: [],
  usuarioActivo: null,
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    setUsuarioActivo: (state, action: PayloadAction<IUsuario>) => {
      state.usuarioActivo = action.payload;
    },
    limpiarUsuarioActivo: (state) => {
      state.usuarioActivo = null;
    },
    setUsuarios: (state, action: PayloadAction<IUsuario[]>) => {
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
