import { configureStore } from "@reduxjs/toolkit";
import detalleProductoReducer from "./slices/detalleProductoReducer";

const store = configureStore({
    reducer: {
        detalleProductoReducer: detalleProductoReducer,
    },
});

export default store;