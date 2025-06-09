import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface ItemCarrito {
  detalle: IDetalle;
  cantidad: number;
}

interface Carrito {
  items: ItemCarrito[];
  detallesActualizados: IDetalle[];
  loading: boolean;
  error: string | null;
}

const initialState: Carrito = {
  items: [],
  detallesActualizados: [],
  loading: false,
  error: null,
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
      // También remover de detalles actualizados
      state.detallesActualizados = state.detallesActualizados.filter(
        detalle => detalle.id !== action.payload
      );
    },
  
    aumentarCantidad(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad < item.detalle.stock) {
        item.cantidad += 1;
      }
    },
    
    disminuirCantidad(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad > 1) {
        item.cantidad -= 1;
      }
    },
    
    actualizarCantidad(state, action: PayloadAction<{ id: number; cantidad: number }>) {
      const { id, cantidad } = action.payload;
      const item = state.items.find(item => item.detalle.id === id);
      if (item && cantidad > 0 && cantidad <= item.detalle.stock) {
        item.cantidad = cantidad;
      }
    },
    
    limpiarCarrito(state) {
      state.items = [];
      state.detallesActualizados = [];
    },
    
    vaciarCarrito: state => {
      state.items = [];
      state.detallesActualizados = [];
    },

    // Nuevas acciones para manejar datos del backend
    setLoadingCarrito: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setErrorCarrito: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    actualizarDetallesDesdeBackend: (state, action: PayloadAction<IDetalle[]>) => {
      state.detallesActualizados = action.payload;
      state.loading = false;
      state.error = null;
    },

    actualizarDetalleEspecifico: (state, action: PayloadAction<IDetalle>) => {
      const detalleActualizado = action.payload;
      const index = state.detallesActualizados.findIndex(d => d.id === detalleActualizado.id);
      
      if (index !== -1) {
        state.detallesActualizados[index] = detalleActualizado;
      } else {
        state.detallesActualizados.push(detalleActualizado);
      }
    },

    sincronizarConStock: (state) => {
      state.items.forEach(item => {
        const detalleActualizado = state.detallesActualizados.find(d => d.id === item.detalle.id);
        if (detalleActualizado) {
          if (item.cantidad > detalleActualizado.stock) {
            item.cantidad = Math.max(0, detalleActualizado.stock);
          }
          item.detalle = detalleActualizado;
        }
      });
      
      state.items = state.items.filter(item => item.cantidad > 0);
    }
  }
});

export const {
  // Acciones originales
  agregarAlCarrito,
  quitarDelCarrito,
  aumentarCantidad,
  disminuirCantidad,
  actualizarCantidad,
  limpiarCarrito,
  vaciarCarrito,
  
  // Nuevas acciones para backend
  setLoadingCarrito,
  setErrorCarrito,
  actualizarDetallesDesdeBackend,
  actualizarDetalleEspecifico,
  sincronizarConStock
} = carritoSlice.actions;

export default carritoSlice.reducer;