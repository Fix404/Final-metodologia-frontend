import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { Usuario, usuariosService } from "../../../services/usuarioService";

export const TablaAdminEmpleados = () => {
  const { activeMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // Función para cargar usuarios
  const cargarUsuarios = async () => {
    // setLoading(true);
    // setError(null);
    
    try {
      const data = await usuariosService.obtenerUsuarios();
      setUsuarios(data);
      console.log(data)
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      
      // Manejo de errores específicos de axios
      // if (err.code === 'ECONNABORTED') {
      //   setError('Tiempo de espera agotado. Inténtalo de nuevo.');
      // } else if (err.response) {
      //   setError(`Error del servidor: ${err.response.status} - ${err.response.data?.message || 'Error desconocido'}`);
      // } else if (err.request) {
      //   setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      // } else {
      //   setError('Error inesperado: ' + err.message);
      // }
    } finally {
      // setLoading(false);
    }
  };

  // Effect para cargar usuarios cuando se activa el menú
  useEffect(() => {
    if (activeMenu === "USUARIOS") {
      cargarUsuarios();
    }
  }, [activeMenu]);
  return (
    <div className="overflow-x-auto">
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
            <p>Email</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Dirección</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Estado</p>
          </th>
          <th className="py-3 px-4 text-left font-semibold border-b">
            <p>Rol</p>
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
                {usuario.email}
              </td>
              <td className="py-2 px-4 border-b">
                {usuario.direccion || 'No especificada'}
              </td>
              <td className="py-2 px-4 border-b">
                {/* {mostrarEstado(usuario.enabled, usuario.accountNonLocked)} */}
              </td>
              <td className="py-2 px-4 border-b">
                {/* {mostrarRol(usuario.rol)} */}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    </div>
  )
}