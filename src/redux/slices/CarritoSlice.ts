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
    agregarAlCarrito(state, action: PayloadAction<IDetalle>) {
      const producto = action.payload;
      const itemExistente = state.items.find(item => item.detalle.id === producto.id);
      
      if (itemExistente) {
        // Si ya existe, aumentar cantidad (respetando stock)
        if (itemExistente.cantidad < producto.stock) {
          itemExistente.cantidad += 1;
        }
      } else {
        // Si no existe, agregarlo con cantidad 1
        state.items.push({
          detalle: producto,
          cantidad: 1
        });
      }
    },
    
    quitarDelCarrito(state, action: PayloadAction<number>) {
      const index = state.items.findIndex(item => item.detalle.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
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
    },
    
    // Acción para actualizar stock de un producto específico en el carrito
    actualizarStockEnCarrito(state, action: PayloadAction<{ id: number; nuevoStock: number }>) {
      const { id, nuevoStock } = action.payload;
      const item = state.items.find(item => item.detalle.id === id);
      if (item) {
        item.detalle.stock = nuevoStock;
        // Si la cantidad actual excede el nuevo stock, ajustarla
        if (item.cantidad > nuevoStock) {
          item.cantidad = Math.max(1, nuevoStock);
        }
      }
    }
  },
});

export const { 
  agregarAlCarrito, 
  quitarDelCarrito, 
  aumentarCantidad, 
  disminuirCantidad, 
  actualizarCantidad, 
  limpiarCarrito,
  actualizarStockEnCarrito
} = carritoSlice.actions;

export default carritoSlice.reducer;