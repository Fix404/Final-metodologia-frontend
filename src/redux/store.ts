import { configureStore } from "@reduxjs/toolkit";
import detalleProductoReducer from "./slices/detalleProductoSlice";
import carritoReducer from './slices/CarritoSlice';
import activeAdminMenuSlice from './slices/activeMenuAdminSlice';
import busquedaReducer from './slices/busquedaSlice';
import productoReducer from './slices/productoSlice'


const store = configureStore({
    reducer: {
        producto: productoReducer,
        detalleProducto: detalleProductoReducer,
        carrito: carritoReducer,
        menuActivoAdmin: activeAdminMenuSlice,
        busqueda: busquedaReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;