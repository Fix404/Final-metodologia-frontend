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

const cargarDesdeLocalStorage = (): Carrito | undefined => {
  try {
    const data = localStorage.getItem('carrito');
    if (!data) return undefined;
    return JSON.parse(data) as Carrito;
  } catch (error) {
    console.warn('Error cargando carrito desde localStorage', error);
    return undefined;
  }
};

const initialState: Carrito = cargarDesdeLocalStorage()  || {
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
        if (itemExistente.cantidad < detalle.stock!) {
          itemExistente.cantidad += 1;
        }
      } else {
        state.items.push({ detalle, cantidad: 1 });
      }
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    quitarDelCarrito: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.detalle.id !== action.payload);
      // También remover de detalles actualizados
      state.detallesActualizados = state.detallesActualizados.filter(
        detalle => detalle.id !== action.payload
      );
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    aumentarCantidad(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad < item.detalle.stock!) {
        item.cantidad += 1;
      }
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    disminuirCantidad(state, action: PayloadAction<number>) {
      const item = state.items.find(item => item.detalle.id === action.payload);
      if (item && item.cantidad > 1) {
        item.cantidad -= 1;
      }
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    actualizarCantidad(state, action: PayloadAction<{ id: number; cantidad: number }>) {
      const { id, cantidad } = action.payload;
      const item = state.items.find(item => item.detalle.id === id);
      if (item && cantidad > 0 && cantidad <= item.detalle.stock!) {
        item.cantidad = cantidad;
      }
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    limpiarCarrito(state) {
      state.items = [];
      state.detallesActualizados = [];
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    vaciarCarrito: state => {
      state.items = [];
      state.detallesActualizados = [];
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    // Nuevas acciones para manejar datos del backend
    setLoadingCarrito: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    setErrorCarrito: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    actualizarDetallesDesdeBackend: (state, action: PayloadAction<IDetalle[]>) => {
      state.detallesActualizados = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    actualizarDetalleEspecifico: (state, action: PayloadAction<IDetalle>) => {
      const detalleActualizado = action.payload;
      const index = state.detallesActualizados.findIndex(d => d.id === detalleActualizado.id);

      if (index !== -1) {
        state.detallesActualizados[index] = detalleActualizado;
      } else {
        state.detallesActualizados.push(detalleActualizado);
      }
      localStorage.setItem('carrito', JSON.stringify(state));
    },

    sincronizarConStock: (state) => {
      state.items.forEach(item => {
        const detalleActualizado = state.detallesActualizados.find(d => d.id === item.detalle.id);
        if (detalleActualizado) {
          if (item.cantidad > detalleActualizado.stock!) {
            item.cantidad = Math.max(0, detalleActualizado.stock!);
          }
          item.detalle = detalleActualizado;
        }
      });

      state.items = state.items.filter(item => item.cantidad > 0);
      localStorage.setItem('carrito', JSON.stringify(state));
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