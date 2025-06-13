import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { limpiarDetalleActivo, setDetalleActivo } from "../redux/slices/detalleProductoSlice";
import { ICategoria } from "../types/ICategoria";
import { limpiarCategoriaActivo, setCategoriaActivo } from "../redux/slices/categoriaSlice";
import { IColor } from "../types/IColor";
import { limpiarColorActivo, setColorActivo } from "../redux/slices/colorSlice";
import { IPrecio } from "../types/IPrecio";
import { limpiarPrecioActivo, setPrecioActivo } from "../redux/slices/precioSlice";
import { categoriaService } from "../services/categoriaService";
import { cargarCategorias, cargarColores, cargarDetalles, cargarPrecios } from "../utils/tablaDetalleUtils";
import { colorService } from "../services/colorService";
import { precioService } from "../services/precioService";
import { IDetalle } from "../types/IDetalle";
import Swal from "sweetalert2";
import { detalleService } from "../services/detalleService";
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

  const handleOpenModalVerDetalle=(detalle:IDetalle)=>{
    setOpenModalSee(true);
    dispatch(setDetalleActivo(detalle));
    setActiveModalType('detalle');
    setOpenModal(false);
  }

  const handleOpenModalEditDetalle=(detalle:IDetalle) => {
    setOpenModalSee(false)
    dispatch(setDetalleActivo(detalle));
    setActiveModalType('detalle');
    setOpenModal(true)
  }

  const handleOpenModalEliminarDetalle=()=>{
    setOpenModalSee(false)
    setActiveModalType('detalle');
    setOpenModal(true)
  }

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

    const handleEliminarDetalle = async (id: number) => {
    const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción deshabilitará el detalle.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, deshabilitar',
          cancelButtonText: 'Cancelar'
        });
    
        if (resultado.isConfirmed) {
          try {
            await detalleService.eliminarDetalle(id);
    
            Swal.fire('Deshabilitado', 'El detalle fue deshabilitado exitosamente.', 'success');
            cargarDetalles(dispatch)
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al deshabilitar el detalle.', 'error');
            console.error("Hubo un error al borrar el detalle", error);
          }
        }
  };

    const handleEliminarCategoria = async (id: number) => {
    const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción deshabilitará la categoría.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, deshabilitar',
          cancelButtonText: 'Cancelar'
        });
    
        if (resultado.isConfirmed) {
          try {
            await categoriaService.eliminarCategoria(id);
    
            Swal.fire('Deshabilitado', 'La categoría fue deshabilitada exitosamente.', 'success');
            cargarCategorias(dispatch)
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al deshabilitar la categoría.', 'error');
            console.error("Hubo un error al borrar la categoría", error);
          }
        }
  };

  const handleEliminarColor = async (id: number) => {
    const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción deshabilitará el color.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, deshabilitar',
          cancelButtonText: 'Cancelar'
        });
    
        if (resultado.isConfirmed) {
          try {
            await colorService.eliminarColor(id);
    
            Swal.fire('Deshabilitado', 'El color fue deshabilitado exitosamente.', 'success');
            cargarColores(dispatch)
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al deshabilitar el color.', 'error');
            console.error("Hubo un error al borrar el color", error);
          }
        }
  };

  const handleEliminarPrecio = async (id: number) => {
    const resultado = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción deshabilitará el precio.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, deshabilitar',
          cancelButtonText: 'Cancelar'
        });
    
        if (resultado.isConfirmed) {
          try {
            await precioService.eliminarPrecio(id);
    
            Swal.fire('Deshabilitado', 'El precio fue deshabilitado exitosamente.', 'success');
            cargarPrecios(dispatch)
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al deshabilitar el precio.', 'error');
            console.error("Hubo un error al borrar el precio", error);
          }
        }
  };

  // Restauraciones

  const handleRestoreDetalle=async(id:number, estado:boolean)=>{
    try{
          await detalleService.cambiarEstadoDetalle(id, estado);
          cargarDetalles(dispatch)
          Swal.fire('Habilitado', 'El detalle fue habilitado exitosamente.', 'success');
        }catch(error){
          console.log("Hubo un error al restaurar", error)
        }
  }

  const handleRestoreCategoria=async(id:number, estado:boolean)=>{
    try{
          await categoriaService.cambiarEstadoCategoria(id, estado);
          cargarCategorias(dispatch)
          Swal.fire('Habilitado', 'La categoria fue habilitada exitosamente.', 'success');
        }catch(error){
          console.log("Hubo un error al restaurar", error)
        }
  }

  const handleRestoreColor=async(id:number, estado:boolean)=>{
    try{
          await colorService.cambiarEstadoColor(id, estado);
          cargarColores(dispatch)
          Swal.fire('Habilitado', 'El color fue habilitado exitosamente.', 'success');
        }catch(error){
          console.log("Hubo un error al restaurar", error)
        }
  }

  const handleRestorePrecio=async(id:number, estado:boolean)=>{
    try{
          await precioService.cambiarEstadoPrecio(id, estado);
          cargarPrecios(dispatch)
          Swal.fire('Habilitado', 'El precio fue habilitado exitosamente.', 'success');
        }catch(error){
          console.log("Hubo un error al restaurar", error)
        }
  }

  return{
    handleOpenModalCrearDetalle,
    handleOpenModalEditDetalle,
    handleOpenModalVerDetalle,
    handleOpenModalEliminarDetalle,
    handleOpenModalVerCategoria,
    handleOpenModalCrearCategoria,
    handleOpenModalCrearColor,
    handleOpenModalCrearPrecio,
    handleOpenModalEditCategoria,
    handleOpenModalEditColor,
    handleOpenModalEditPrecio,
    handleOpenModalVerColor,
    handleOpenModalVerPrecio,
    handleEliminarDetalle,
    handleEliminarCategoria,
    handleEliminarColor,
    handleEliminarPrecio,
    handleRestoreDetalle,
    handleRestoreCategoria,
    handleRestoreColor,
    handleRestorePrecio
  }
}