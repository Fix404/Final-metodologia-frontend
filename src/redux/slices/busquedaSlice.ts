// src/redux/slices/busquedaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusquedaState {
  texto: string;
}

const initialState: BusquedaState = {
  texto: "",
};

const busquedaSlice = createSlice({
  name: "busqueda",
  initialState,
  reducers: {
    setTextoBusqueda: (state, action: PayloadAction<string>) => {
      state.texto = action.payload;
    },
    limpiarBusqueda: (state) => {
      state.texto = "";
    },
  },
});

export const { setTextoBusqueda, limpiarBusqueda } = busquedaSlice.actions;
export default busquedaSlice.reducer;
