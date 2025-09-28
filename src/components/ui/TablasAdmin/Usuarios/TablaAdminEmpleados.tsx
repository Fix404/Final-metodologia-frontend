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
import { TbGrave2 } from "react-icons/tb";

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
      const data = await usuariosService.obtenerUsuariosActivos();
      const soloEmpleados = data.filter((usuario:IUsuario) => 
        usuario.rol === "ADMIN"
      );
      setUsuarios(soloEmpleados);
      console.log(soloEmpleados)
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const hacerCliente = async (idUsuario: number, usuario: IUsuario) => {
    try {
      const usuarioActualizado: IUsuario = { ...usuario, rol: "CLIENTE" };
      const data = await usuariosService.actualizarUsuario(
        idUsuario,
        usuarioActualizado
      );
      console.log(data);

      setUsuarios((prev) =>
        prev.map((u) => (u.id === idUsuario ? { ...u, rol: "CLIENTE" } : u))
      );
    } catch (error) {
      console.log("Hubo un error", error);
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
    setOpenModalSee(false);
    setOpenModal(true);
  }

  const handleCloseModal= () => {
    dispatch(limpiarUsuarioActivo())
    setOpenModal(false);
    cargarUsuarios()
  }

  const handleDelete = async (id: number) => {
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
        await usuariosService.eliminarUsuario(id);

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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">EMPLEADOS</h1>
        <button
          onClick={() => handleOpenModalCrear()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          + Crear Empleado
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Apellido
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Dirección
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Rol
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No hay usuarios para mostrar
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.nombre || 'Sin nombre'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.apellido || 'Sin apellido'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {typeof usuario.direccion === "object" && usuario.direccion !== null
                        ? usuario.direccion.calle
                        : usuario.direccion || "No especificada"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                                                  title="Ascender a cliente"
                                                  onClick={() => hacerCliente(usuario.id!, usuario)}
                                                  className="p-2 text-gray-500 hover:text-white hover:bg-gray-500 rounded-lg transition-all duration-200"
                                                >
                                                  <TbGrave2 size={18}/>
                                                </button>
                        <button
                          title="Ver"
                          onClick={() => handleOpenModalVer(usuario)}
                          className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200"
                        >
                          <IoEyeSharp size={18} />
                        </button>
                        <button
                          title="Editar"
                          onClick={() => handleOpenModalEdit(usuario)}
                          className="p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleDelete(usuario.id!)}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                        >
                          <IoTrashBinOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {openModal && <UsuarioModal activeUser={usuarioActivo} openModalSee={openModalSee} handleCloseModal={handleCloseModal}/>}
    </>
  )
}