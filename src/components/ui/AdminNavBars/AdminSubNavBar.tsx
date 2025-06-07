import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { closeDropdown, setActiveMenu, setActiveSubMenu, type MenuSection } from '../../../redux/slices/activeMenuAdminSlice';

export const AdminSubNavBar= () => {
  const dispatch = useAppDispatch();
  const { activeMenu, activeSubMenu, isDropdownOpen } = useAppSelector((state) => state.menuActivoAdmin);

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

  const handleMouseEnter = (menu: MenuSection) => {
    dispatch(setActiveMenu(menu));
  };

  const handleMenuAreaLeave = () => {
    dispatch(closeDropdown());
  };

  const handleSubMenuClick = (subMenu: string) => {
    dispatch(setActiveSubMenu(subMenu));
    dispatch(closeDropdown());
    console.log(`Selected: ${activeMenu} -> ${subMenu}`);
    // Aquí puedes agregar lógica de navegación
  };

  return (
    <div className="w-full h-10 bg-gray-300 text-xl flex items-center justify-center gap-8 relative">
      {Object.keys(menuItems).map((menuName) => (
        <div
          key={menuName}
          className="relative"
          onMouseLeave={handleMenuAreaLeave}
        >
          <div 
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 ${
              activeMenu === menuName ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600'
            }`}
            onMouseEnter={() => handleMouseEnter(menuName as MenuSection)}
          >
            <p className="font-medium">{menuName}</p>
          </div>
          
          {/* Menú desplegable */}
          {isDropdownOpen && activeMenu === menuName && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50"
              onMouseEnter={() => handleMouseEnter(menuName as MenuSection)}
            >
              <div className="py-2">
                {menuItems[menuName as keyof typeof menuItems].map((item, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                      activeSubMenu === item 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => handleSubMenuClick(item)}
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