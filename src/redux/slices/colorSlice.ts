import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IColor } from "../../types/IColor";

interface ColorState {
  colores: IColor[];
  colorActivo:IColor | null;
}

const initialState: ColorState = {
  colores: [],
  colorActivo: null
};

const colorSlice = createSlice({
  name: "colorReducer",
  initialState,
  reducers: {
    fetchColor: (state, action: PayloadAction<IColor[]>) => {
      state.colores = action.payload;
    },
    setColorActivo:(state, action: PayloadAction<IColor>) => {
          state.colorActivo = action.payload;
        },
        limpiarColorActivo: (state) => {
          state.colorActivo = null;
        },
        setColores: (state, action: PayloadAction<IColor[]>) => {
              state.colores = action.payload;
            },
  },
});

export const { fetchColor, setColorActivo, limpiarColorActivo, setColores } =
    colorSlice.actions;

export default colorSlice.reducer;