import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IDetalle } from '../../types/IDetalle';
import { IUsuario } from '../../types/IUsuario';
import { IDireccion } from '../../types/IDireccion';
import { IOrdenCompra } from '../../types/IOrdenCompra';

interface OrdenCompraInput {
  usuario: IUsuario;
  detalles: (IDetalle & { cantidadComprada: number })[];
  total: number;
  metodoPago: 'transferencia' | 'mercadopago';
  dni?: string;
  direccionEnvio: IDireccion;
}

interface CompraState {
  dni: string | null;
  direccionEnvio: IDireccion | null;
  metodoPago: 'transferencia' | 'mercadopago' | null;
  procesando: boolean;
  error: string | null;
  ordenGenerada: IOrdenCompra | null;
  pasoActual: 'datos' | 'direccion' | 'pago' | 'confirmacion';
}

const initialState: CompraState = {
  dni: null,
  direccionEnvio: null,
  metodoPago: null,
  procesando: false,
  error: null,
  ordenGenerada: null,
  pasoActual: 'datos',
};

// Thunk para procesar la compra
export const procesarCompra = createAsyncThunk(
  'compra/procesarCompra',
  async (ordenData: OrdenCompraInput, { rejectWithValue }) => {
    try {
      // Simular llamada a API
      const response = await fetch('/api/ordenes-compra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: ordenData.usuario.id,
          detalles: ordenData.detalles.map(detalle => ({
            detalleId: detalle.id,
            cantidad: detalle.cantidadComprada,
            precioUnitario: detalle.precio.precioVenta,
          })),
          total: ordenData.total,
          metodoPago: ordenData.metodoPago,
          dni: ordenData.dni,
          direccionEnvio: ordenData.direccionEnvio,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la compra');
      }

      const ordenCompra: IOrdenCompra = await response.json();
      return ordenCompra;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Thunk para generar link de Mercado Pago
export const generarLinkMercadoPago = createAsyncThunk(
  'compra/generarLinkMercadoPago',
  async (ordenId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/mercadopago/generar-link/${ordenId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al generar link de Mercado Pago');
      }

      const { linkPago } = await response.json();
      return linkPago;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const compraSlice = createSlice({
  name: 'compra',
  initialState,
  reducers: {
    setDni: (state, action: PayloadAction<string>) => {
      state.dni = action.payload;
    },
    
    setDireccionEnvio: (state, action: PayloadAction<IDireccion>) => {
      state.direccionEnvio = action.payload;
    },
    
    setMetodoPago: (state, action: PayloadAction<'transferencia' | 'mercadopago'>) => {
      state.metodoPago = action.payload;
    },
    
    setPasoActual: (state, action: PayloadAction<'datos' | 'direccion' | 'pago' | 'confirmacion'>) => {
      state.pasoActual = action.payload;
    },
    
    limpiarCompra: (state) => {
      state.dni = null;
      state.direccionEnvio = null;
      state.metodoPago = null;
      state.procesando = false;
      state.error = null;
      state.ordenGenerada = null;
      state.pasoActual = 'datos';
    },
    
    limpiarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Procesar compra
      .addCase(procesarCompra.pending, (state) => {
        state.procesando = true;
        state.error = null;
      })
      .addCase(procesarCompra.fulfilled, (state, action) => {
        state.procesando = false;
        state.ordenGenerada = action.payload;
        state.pasoActual = 'confirmacion';
      })
      .addCase(procesarCompra.rejected, (state, action) => {
        state.procesando = false;
        state.error = action.payload as string;
      })
      
      // Generar link de Mercado Pago
      .addCase(generarLinkMercadoPago.pending, (state) => {
        state.procesando = true;
      })
      .addCase(generarLinkMercadoPago.fulfilled, (state) => {
        state.procesando = false;
        // El link se maneja en el componente
      })
      .addCase(generarLinkMercadoPago.rejected, (state, action) => {
        state.procesando = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setDni,
  setDireccionEnvio,
  setMetodoPago,
  setPasoActual,
  limpiarCompra,
  limpiarError,
} = compraSlice.actions;

export default compraSlice.reducer;