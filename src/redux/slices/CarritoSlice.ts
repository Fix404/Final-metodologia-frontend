import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';

interface ItemCarrito {
  detalle: IDetalle;
  cantidad: number;
}

interface Carrito {
  items: ItemCarrito[];
  // Nuevos estados para manejar datos del backend
  detallesActualizados: IDetalle[];
  loading: boolean;
  error: string | null;
}

const initialState: Carrito = {
  items: [],
  // Estados para datos del backend
  detallesActualizados: [],
  loading: false,
  error: null,
};

export const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    // Acciones originales (mantienen funcionalidad actual)
    agregarAlCarrito: (state, action: PayloadAction<IDetalle>) => {
      const detalle = action.payload;
      const itemExistente = state.items.find(item => item.detalle.id === detalle.id);
      if (itemExistente) {
        // Solo aumentar cantidad si hay stock disponible
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

    // Acción para sincronizar cantidades con stock actualizado del backend
    sincronizarConStock: (state) => {
      state.items.forEach(item => {
        const detalleActualizado = state.detallesActualizados.find(d => d.id === item.detalle.id);
        if (detalleActualizado) {
          // Si la cantidad en carrito es mayor al stock disponible, ajustar
          if (item.cantidad > detalleActualizado.stock) {
            item.cantidad = Math.max(0, detalleActualizado.stock);
          }
          // Actualizar el detalle en el carrito con datos frescos del backend
          item.detalle = detalleActualizado;
        }
      });
      
      // Remover items que ya no tienen stock
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