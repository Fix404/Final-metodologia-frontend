import { configureStore } from "@reduxjs/toolkit";
import detalleProductoReducer from "./slices/detalleProductoSlice";
import carritoReducer from './slices/CarritoSlice'
import activeAdminMenuSlice from './slices/activeMenuAdminSlice'

const store = configureStore({
    reducer: {
        detalleProducto: detalleProductoReducer,
        carrito: carritoReducer,
        menuActivoAdmin: activeAdminMenuSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;