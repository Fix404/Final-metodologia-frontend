import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProducto } from "../../types/IProducto";

interface ProductoState {
  productos: IProducto[];
  productoActivo:IProducto | null;
}

const initialState: ProductoState = {
  productos: [],
  productoActivo: null
};

const productoSlice = createSlice({
  name: "productoReducer",
  initialState,
  reducers: {
    fetchProducto: (state, action: PayloadAction<IProducto[]>) => {
      state.productos = action.payload;
    },
    setProductoActivo:(state, action: PayloadAction<IProducto>) => {
          state.productoActivo = action.payload;
        },
        limpiarProductoActivo: (state) => {
          state.productoActivo = null;
        },
        setProductos: (state, action: PayloadAction<IProducto[]>) => {
              state.productos = action.payload;
            },
  },
});

export const { fetchProducto, setProductoActivo, limpiarProductoActivo, setProductos } =
    productoSlice.actions;

export default productoSlice.reducer;
