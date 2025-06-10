import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { usuariosService } from "../../../../services/usuarioService";
import { IUsuario } from "../../../../types/IUsuario";
import { useDispatch } from "react-redux";
import { limpiarUsuarioActivo, setUsuarioActivo } from "../../../../redux/slices/usuarioSlice";
import Swal from "sweetalert2";
import { IoEyeSharp, IoTrashBinOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { UsuarioModal } from "../../Modals/AdminModals/UsuarioModal";

export const TablaAdminEmpleados = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [openModal, setOpenModal] = useState(false);
    const [openModalSee, setOpenModalSee] = useState(false);
    const usuarioActivo=useAppSelector((state) => state.usuario.usuarioActivo);
    const dispatch=useDispatch()

  // Función para cargar usuarios
  const cargarUsuarios = async () => {
    
    try {
      const data = await usuariosService.obtenerUsuarios();
      const soloEmpleados = data.filter((usuario:IUsuario) => 
        usuario.rol === "ADMIN"
);
setUsuarios(soloEmpleados);
      console.log(soloEmpleados)
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };
  const handleOpenModalVer=(usuario:IUsuario) =>{
      setOpenModalSee(true);
      dispatch(setUsuarioActivo(usuario))
      setOpenModal(true);
    }
  
    const handleOpenModalEdit=(usuario:IUsuario) =>{
      setOpenModalSee(false);
      dispatch(setUsuarioActivo(usuario))
      setOpenModal(true);
    }
  
    const handleOpenModalCrear=() => {
      dispatch(limpiarUsuarioActivo())
      setOpenModal(true);
    }
  
    const handleCloseModal= () => {
      dispatch(limpiarUsuarioActivo())
      setOpenModal(false);
      cargarUsuarios()
    }
    const handleDelete = async (id: number, usuario: IUsuario) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción deshabilitará al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar'
    });
  
    if (resultado.isConfirmed) {
      try {
        const usuarioActualizado: IUsuario = {
          ...usuario,
          activo: false
        };
  
        await usuariosService.eliminarUsuario(id, usuarioActualizado);
  
        Swal.fire('Deshabilitado', 'El usuario fue deshabilitado exitosamente.', 'success');
        cargarUsuarios()
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al deshabilitar el usuario.', 'error');
        console.error("Hubo un error al borrar el usuario", error);
      }
    }
  };

  // Effect para cargar usuarios cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Empleados") {
      cargarUsuarios();
    }
  }, [activeSubMenu]);
  return (
    <>
    <div className="overflow-x-auto">
      <div className="text-4xl font-bold justify-self-center py-7">
        <h1>EMPLEADOS</h1>
      </div>
      <button
              onClick={() => handleOpenModalCrear()}
              className="bg-blue-700 hover:bg-blue-500 text-white text-3xl font-semibold py-1 px-2 cursor-pointer rounded shadow-md transition"
            >
              <p>Crear Empleado</p>
            </button>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>ID</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Nombre</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Apellido</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Email</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Dirección</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Rol</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Acciones</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length === 0 ? (
          <tr>
            <td className="py-8 px-4 text-center text-gray-500 border-b">
              No hay usuarios para mostrar
            </td>
          </tr>
        ) : (
          usuarios.map((usuario) => (
            <tr key={usuario.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b font-medium">
                {usuario.id}
              </td>
              <td className="py-2 px-4 border-b">
                {usuario.nombre || 'Sin nombre'}
              </td>
              <td className="py-2 px-4 border-b">
                {usuario.apellido || 'Sin apellido'}
              </td>
              <td className="py-2 px-4 border-b">
                {usuario.email}
              </td>
                              <td className="py-2 px-4 border-b">
                                 {typeof usuario.direccion === "object" && usuario.direccion !== null
                  ? usuario.direccion.calle
                  : usuario.direccion || "No especificada"}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {usuario.rol}
                              </td>
                              <td className="py-2 px-4 border-b">
                <div className="flex justify-center gap-2">
                  <button
                  title="Ver"
                    onClick={() => handleOpenModalVer(usuario)}
                    className="bg-green-500 hover:bg-green-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <IoEyeSharp />
                  </button>
                  <button
                    title="Editar"
                    onClick={() => handleOpenModalEdit(usuario)}
                    className="bg-purple-500 hover:bg-purple-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <MdEdit />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => handleDelete(usuario.id!, usuario)}
                    className="bg-red-500 hover:bg-red-400 text-white cursor-pointer w-auto font-semibold py-2 px-2 rounded shadow-md transition"
                  >
                    <IoTrashBinOutline />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
    {openModal && <UsuarioModal activeUser={usuarioActivo} openModalSee={openModalSee} handleCloseModal={handleCloseModal}/>}
    </>
  )
}