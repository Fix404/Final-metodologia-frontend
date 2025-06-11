import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPrecio } from "../../types/IPrecio";

interface PrecioState {
  precios: IPrecio[];
  precioActivo:IPrecio | null;
}

const initialState: PrecioState = {
  precios: [],
  precioActivo: null
};

const precioSlice = createSlice({
  name: "precioReducer",
  initialState,
  reducers: {
    fetchPrecio: (state, action: PayloadAction<IPrecio[]>) => {
      state.precios = action.payload;
    },
    setPrecioActivo:(state, action: PayloadAction<IPrecio>) => {
          state.precioActivo = action.payload;
        },
        limpiarPrecioActivo: (state) => {
          state.precioActivo = null;
        },
        setPrecios: (state, action: PayloadAction<IPrecio[]>) => {
              state.precios = action.payload;
            },
  },
});

export const { fetchPrecio, setPrecioActivo, limpiarPrecioActivo, setPrecios } =
    precioSlice.actions;

export default precioSlice.reducer;