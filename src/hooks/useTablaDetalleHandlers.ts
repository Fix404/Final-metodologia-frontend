import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { limpiarDetalleActivo } from "../redux/slices/detalleProductoSlice";
import { ICategoria } from "../types/ICategoria";
import { limpiarCategoriaActivo, setCategoriaActivo } from "../redux/slices/categoriaSlice";
import { IColor } from "../types/IColor";
import { limpiarColorActivo, setColorActivo } from "../redux/slices/colorSlice";
import { IPrecio } from "../types/IPrecio";
import { limpiarPrecioActivo, setPrecioActivo } from "../redux/slices/precioSlice";
import { categoriaService } from "../services/categoriaService";
import { cargarCategorias, cargarColores } from "../utils/tablaDetalleUtils";
import { colorService } from "../services/colorService";
import { precioService } from "../services/precioService";
type ModalType = 'categoria' | 'color' | 'precio' | 'detalle'| null;



export const useTablaDetalleHandlers=({
    setOpenModal,
    setOpenModalSee,
    setActiveModalType
}:{setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalSee: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveModalType: React.Dispatch<React.SetStateAction<ModalType>>;
})=>{
    const dispatch=useDispatch();

    const handleOpenModalCrearDetalle = useCallback(() => {
    dispatch(limpiarDetalleActivo());
    setOpenModalSee(false);
    setActiveModalType('detalle');
    setOpenModal(true);
  }, []);

  const handleOpenModalVerCategoria = useCallback((categoria:ICategoria) => {
    setOpenModalSee(true);
    dispatch(setCategoriaActivo(categoria));
    setActiveModalType('categoria');
    setOpenModal(true);
  }, [setOpenModalSee, setOpenModal, setActiveModalType]);

  const handleOpenModalEditCategoria = (categoria: ICategoria) => {
      setOpenModalSee(false);
      dispatch(setCategoriaActivo(categoria));
      setActiveModalType('categoria');
      setOpenModal(true);
    };
  
    const handleOpenModalCrearCategoria = () => {
      dispatch(limpiarCategoriaActivo());
      setOpenModalSee(false);
      setActiveModalType('categoria');
      setOpenModal(true);
    };
  
    const handleOpenModalVerColor = (color: IColor) => {
      setOpenModalSee(true);
      dispatch(setColorActivo(color));
      setActiveModalType('color');
      setOpenModal(true);
    };
  
    const handleOpenModalEditColor = (color: IColor) => {
      setOpenModalSee(false);
      dispatch(setColorActivo(color));
      setActiveModalType('color');
      setOpenModal(true);
    };
  
    const handleOpenModalCrearColor = () => {
      dispatch(limpiarColorActivo());
      setOpenModalSee(false);
      setActiveModalType('color');
      setOpenModal(true);
    };
  
    const handleOpenModalVerPrecio = (precio: IPrecio) => {
      setOpenModalSee(true);
      dispatch(setPrecioActivo(precio));
      setActiveModalType('precio');
      setOpenModal(true);
    };
  
    const handleOpenModalEditPrecio = (precio: IPrecio) => {
      setOpenModalSee(false);
      dispatch(setPrecioActivo(precio));
      setActiveModalType('precio');
      setOpenModal(true);
    };
  
    const handleOpenModalCrearPrecio = () => {
      dispatch(limpiarPrecioActivo());
      setOpenModalSee(false);
      setActiveModalType('precio');
      setOpenModal(true);
    };


    // Eliminaciones

    const handleEliminarCategoria = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        await categoriaService.eliminarCategoria(id);
        cargarCategorias(dispatch);
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  const handleEliminarColor = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este color?')) {
      try {
        await colorService.eliminarColor(id);
        cargarColores(dispatch);
      } catch (error) {
        console.error("Error al eliminar color:", error);
      }
    }
  };

  const handleEliminarPrecio = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este color?')) {
      try {
        await precioService.eliminarPrecio(id);
        cargarColores(dispatch);
      } catch (error) {
        console.error("Error al eliminar color:", error);
      }
    }
  };

  return{
    handleOpenModalCrearDetalle,
    handleOpenModalVerCategoria,
    handleOpenModalCrearCategoria,
    handleOpenModalCrearColor,
    handleOpenModalCrearPrecio,
    handleOpenModalEditCategoria,
    handleOpenModalEditColor,
    handleOpenModalEditPrecio,
    handleOpenModalVerColor,
    handleOpenModalVerPrecio,
    handleEliminarCategoria,
    handleEliminarColor,
    handleEliminarPrecio
  }
}