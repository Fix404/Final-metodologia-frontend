import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategoria } from "../../types/ICategoria";

interface CategoriaState {
  categorias: ICategoria[];
  categoriaActivo:ICategoria | null;
}

const initialState: CategoriaState = {
  categorias: [],
  categoriaActivo: null
};

const categoriaSlice = createSlice({
  name: "categoriaReducer",
  initialState,
  reducers: {
    fetchCategoria: (state, action: PayloadAction<ICategoria[]>) => {
      state.categorias = action.payload;
    },
    setCategoriaActivo:(state, action: PayloadAction<ICategoria>) => {
          state.categoriaActivo = action.payload;
        },
        limpiarCategoriaActivo: (state) => {
          state.categoriaActivo = null;
        },
        setCategorias: (state, action: PayloadAction<ICategoria[]>) => {
              state.categorias = action.payload;
            },
  },
});

export const { fetchCategoria, setCategoriaActivo, limpiarCategoriaActivo, setCategorias } =
    categoriaSlice.actions;

export default categoriaSlice.reducer;