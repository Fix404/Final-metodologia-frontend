import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IOrdenCompra } from "../../types/IOrdenCompra";
import { ordenesCompraService } from "../../services/ordenesCompraService";

export const fetchOrdenesCompra = createAsyncThunk<
  IOrdenCompra[]
>(
  "ordenesCompra/fetchAll",
  async () => {
    const data = await ordenesCompraService.obtenerOrdenesCompra();
    return data;
  }
);

interface OrdenesCompraState {
  ordenes: IOrdenCompra[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdenesCompraState = {
  ordenes: [],
  loading: false,
  error: null,
};

const ordenesCompraSlice = createSlice({
  name: "ordenesCompra",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenesCompra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdenesCompra.fulfilled,
        (state, action: PayloadAction<IOrdenCompra[]>) => {
          state.loading = false;
          state.ordenes = action.payload;
        }
      )
      .addCase(fetchOrdenesCompra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error al cargar órdenes";
      });
  },
});

export default ordenesCompraSlice.reducer;
