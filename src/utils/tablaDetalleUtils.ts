import { fetchCategoria } from "../redux/slices/categoriaSlice";
import { fetchColor } from "../redux/slices/colorSlice";
import { fetchDetalles } from "../redux/slices/detalleProductoSlice";
import { fetchPrecio } from "../redux/slices/precioSlice";
import { fetchProducto } from "../redux/slices/productoSlice";
import { AppDispatch } from "../redux/store";
import { categoriaService } from "../services/categoriaService";
import { colorService } from "../services/colorService";
import { detalleService } from "../services/detalleService";
import { precioService } from "../services/precioService";
import { productoService } from "../services/productoService";

export const cargarProductos = async (dispatch:AppDispatch) => {
    try {
      const response = await productoService.obtenerProductos();
      dispatch(fetchProducto(response));
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

export const cargarColores = async (dispatch:AppDispatch) => {
    try {
      const response = await colorService.obtenerColores();
      dispatch(fetchColor(response));
    } catch (err) {
      console.error("Error al obtener colores:", err);
    }
  };

  export const cargarCategorias = async (dispatch:AppDispatch) => {
      try {
        const response = await categoriaService.obtenerCategorias();
        dispatch(fetchCategoria(response));
      } catch (error) {
        console.error("Error al obtener las categorías", error);
      }
    };
  
    export const cargarPrecios = async (dispatch:AppDispatch) => {
      try {
        const response = await precioService.obtenerPrecios();
        dispatch(fetchPrecio(response));
      } catch (error) {
        console.error("Error al obtener los precios", error);
      }
    };
  
    export const cargarDetalles = async (dispatch:AppDispatch) => {
      try {
        const response = await detalleService.obtenerDetalles();
        console.log("RESPUESTA: ", response)
        dispatch(fetchDetalles(response));
      } catch (error) {
        console.error("Error al obtener los detalles", error);
      }
    };