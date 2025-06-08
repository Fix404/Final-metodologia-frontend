import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProducto } from "../../types/IProducto";

interface producto {
  productos: IProducto[];
}

const initialState: producto = {
  productos: [],
};

const productoSlice = createSlice({
  name: "productoReducer",
  initialState,
  reducers: {
    fetchProducto: (state, action: PayloadAction<IProducto[]>) => {
      state.productos = action.payload;
    },
  },
});

export const { fetchProducto } =
    productoSlice.actions;

export default productoSlice.reducer;
