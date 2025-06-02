import { createSlice } from "@reduxjs/toolkit";
import { IDetalle } from "../../types/IDetalle";

interface detalleProducto{
    productos:IDetalle[]
}
const initialState:detalleProducto={
    productos:[]
}
const detalleProductoReducer = createSlice({
    name: "detalleProductoReducer",
    initialState: initialState,
    reducers: {
        fetchDetalleProducto: (state, action) => {
             state.productos= action.payload;
        }
    }
});

export const {fetchDetalleProducto} =detalleProductoReducer.actions;

export default detalleProductoReducer.reducer;