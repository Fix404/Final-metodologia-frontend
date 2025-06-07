import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDetalle } from "../../types/IDetalle";

interface detalleProducto {
  detalles: IDetalle[];
}

const initialState: detalleProducto = {
  detalles: [],
};

const detalleProductoSlice = createSlice({
  name: "detalleProductoReducer",
  initialState,
  reducers: {
    fetchDetalleProducto: (state, action: PayloadAction<IDetalle[]>) => {
      state.detalles = action.payload;
    },
    descontarStock: (state, action: PayloadAction<number>) => {
      const producto = state.detalles.find(p => p.id === action.payload);
      if (producto && producto.stock > 0) {
        producto.stock--;
      }
    },
    restaurarStock: (state, action: PayloadAction<number>) => {
      const producto = state.detalles.find(p => p.id === action.payload);
      if (producto) {
        producto.stock++;
      }
    },
  },
});

export const { fetchDetalleProducto, descontarStock, restaurarStock } =
  detalleProductoSlice.actions;

export default detalleProductoSlice.reducer;
