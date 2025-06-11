import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface DetalleProductoState {
  detalles: IDetalle[];
  detalleActivo: IDetalle | null;
}

const initialState: DetalleProductoState = {
  detalles: [],
  detalleActivo: null
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
    setDetalleActivo:(state, action: PayloadAction<IDetalle>) => {
              state.detalleActivo = action.payload;
            },
    limpiarDetalleActivo: (state) => {
          state.detalleActivo = null;
        },
        setDetalles: (state, action: PayloadAction<IDetalle[]>) => {
                      state.detalles = action.payload;
                    },
  },
});

export const {
  fetchDetalles,
  fetchDetallesByProductoId,
  clearDetalles,
  descontarStock,
  restaurarStock,
  setDetalleActivo,
  limpiarDetalleActivo,
  setDetalles
} = detalleProductoSlice.actions;

export default detalleProductoSlice.reducer;
