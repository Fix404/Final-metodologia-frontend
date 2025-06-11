import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface DetalleProductoState {
  detalles: IDetalle[];
}

const initialState: DetalleProductoState = {
  detalles: [],
};

const detalleProductoSlice = createSlice({
  name: 'detalleProducto',
  initialState,
  reducers: {
    fetchDetalles: (state, action: PayloadAction<IDetalle[]>) => {
      state.detalles = action.payload;
    },
    fetchDetallesByProductoId: (state, action: PayloadAction<number>) => {
      const productoId = action.payload;
      state.detalles = state.detalles.filter(detalle => detalle.producto.id === productoId);
    },
    clearDetalles: (state) => {
      state.detalles = [];
    },
    descontarStock: (state, action: PayloadAction<number>) => {
      const detalle = state.detalles.find(d => d.id === action.payload);
      if (detalle && detalle.stock! > 0) {
        detalle.stock!--;
      }
    },
    restaurarStock: (state, action: PayloadAction<number>) => {
      const detalle = state.detalles.find(d => d.id === action.payload);
      if (detalle) {
        detalle.stock!++;
      }
    },
  },
});

export const {
  fetchDetalles,
  fetchDetallesByProductoId,
  clearDetalles,
  descontarStock,
  restaurarStock,
} = detalleProductoSlice.actions;

export default detalleProductoSlice.reducer;
