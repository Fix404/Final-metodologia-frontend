import { useState } from "react";

export const AdminSubNavBar = () => {
  
  const menuItems = {
    USUARIOS: [
      "Gestionar Usuarios",
      "Roles y Permisos",
      "Usuarios Activos",
      "Usuarios Bloqueados"
    ],
    PRODUCTOS: [
      "Catálogo",
      "Agregar Producto",
      "Inventario",
      "Categorías",
      "Ofertas y Descuentos"
    ],
    PEDIDOS: [
      "Pedidos Pendientes",
      "Historial de Pedidos",
      "Devoluciones",
      "Seguimiento"
    ],
    ESTADÍSTICAS: [
      "Dashboard",
      "Ventas",
      "Usuarios",
      "Productos Populares",
      "Reportes"
    ],
    FACTURACIÓN: [
      "Facturas Emitidas",
      "Pagos Pendientes",
      "Historial de Pagos",
      "Configuración Fiscal"
    ]
  };
  type MenuName = keyof typeof menuItems;
  const [activeMenu, setActiveMenu] = useState<MenuName|null>(null);


  const handleMouseEnter = (menu:MenuName) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="w-full h-10 bg-gray-300 text-xl flex items-center justify-center gap-8 relative">
      {Object.keys(menuItems).map((menuName) => (
        <div
          key={menuName}
          className="relative"
          onMouseEnter={() => handleMouseEnter(menuName as MenuName)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="cursor-pointer hover:text-blue-600 transition-colors duration-200 px-4 py-2">
            <p className="font-medium">{menuName}</p>
          </div>
          {activeMenu === menuName && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50">
              <div className="py-2">
                {menuItems[menuName].map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
                    onClick={() => console.log(`Clicked: ${item}`)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};