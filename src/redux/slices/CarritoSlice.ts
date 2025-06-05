import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface Carrito {
  items: IDetalle[];
}

const initialState: Carrito = {
  items: [],
};

export const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito(state, action: PayloadAction<IDetalle>) {
      const producto = action.payload;
      state.items.push(producto); 
    },
    quitarDelCarrito(state, action: PayloadAction<number>) {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
  },
});

export const { agregarAlCarrito, quitarDelCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
