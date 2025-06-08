// src/redux/slices/busquedaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProducto } from "../../types/IProducto";

interface BusquedaState {
  texto: string;
  resultados: IProducto[];
}

const initialState: BusquedaState = {
  texto: "",
  resultados: [],
};

const busquedaSlice = createSlice({
  name: "busqueda",
  initialState,
  reducers: {
    setTexto: (state, action: PayloadAction<string>) => {
      state.texto = action.payload;
    },
    setResultados: (state, action: PayloadAction<IProducto[]>) => {
      state.resultados = action.payload;
    },
    limpiarBusqueda: (state) => {
      state.texto = "";
      state.resultados = [];
    },
  },
});

export const { setTexto, setResultados, limpiarBusqueda } = busquedaSlice.actions;
export default busquedaSlice.reducer;
