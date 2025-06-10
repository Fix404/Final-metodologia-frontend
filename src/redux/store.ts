import { configureStore } from "@reduxjs/toolkit";
import detalleProductoReducer from "./slices/detalleProductoSlice";
import carritoReducer from './slices/CarritoSlice'
import activeAdminMenuSlice from './slices/activeMenuAdminSlice'
import compraReducer from "./slices/CompraSlice"
import busquedaReducer from './slices/busquedaSlice';
import productoReducer from './slices/productoSlice';
import usuarioReducer from './slices/usuarioSlice'
import authReducer from './slices/authSlice'
import ordenesCompraReducer from "./slices/ordenesCompraSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        producto: productoReducer,
        detalleProducto: detalleProductoReducer,
        carrito: carritoReducer,
        menuActivoAdmin: activeAdminMenuSlice,
        compra: compraReducer,
        busqueda: busquedaReducer,
        usuario: usuarioReducer,
        ordenesCompra: ordenesCompraReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;