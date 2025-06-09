import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { Usuario, usuariosService } from "../../../../services/usuarioService";

export const TablaAdminEmpleados = () => {
  const { activeSubMenu } = useAppSelector((state) => state.menuActivoAdmin);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Función para cargar usuarios
  const cargarUsuarios = async () => {
    
    try {
      const data = await usuariosService.obtenerUsuarios();
      const soloAdmins = data.filter((usuario:Usuario) => 
        usuario.rol === "ADMIN"
);
setUsuarios(soloAdmins);
      console.log(soloAdmins)
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  // Effect para cargar usuarios cuando se activa el menú
  useEffect(() => {
    if (activeSubMenu === "Empleados") {
      cargarUsuarios();
    }
  }, [activeSubMenu]);
  return (
    <div className="overflow-x-auto">
      <div className="text-4xl font-bold justify-self-center py-7">
        <h1>EMPLEADOS</h1>
      </div>
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