import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface ItemCarrito {
  detalle: IDetalle;
  cantidad: number;
}

interface Carrito {
  items: ItemCarrito[];
}

const initialState: Carrito = {
  items: [],
};

export const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito: (state, action: PayloadAction<IDetalle>) => {
      const detalle = action.payload;
      const itemExistente = state.items.find(item => item.detalle.id === detalle.id);
      if (itemExistente) {
        if (itemExistente.cantidad < detalle.stock) {
          itemExistente.cantidad += 1;
        }
      } else {
        state.items.push({ detalle, cantidad: 1 });
      }
    },
    quitarDelCarrito: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.detalle.id !== action.payload);
    },
    aumentarCantidad: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad < item.detalle.stock) {
        item.cantidad += 1;
      }
    },
    disminuirCantidad: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad > 1) {
        item.cantidad -= 1

          ;
      }
    },
    vaciarCarrito: state => {
      state.items = [];
    }
  }
});

export const {
  agregarAlCarrito,
  quitarDelCarrito,
  aumentarCantidad,
  disminuirCantidad,
  vaciarCarrito
} = carritoSlice.actions;

export default carritoSlice.reducer;