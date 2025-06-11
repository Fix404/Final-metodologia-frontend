import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { closeDropdown, setActiveMenu, setActiveSubMenu, type MenuSection } from '../../../redux/slices/activeMenuAdminSlice';
import { useNavigate } from 'react-router-dom';

export const AdminSubNavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 
  const { activeMenu, activeSubMenu, isDropdownOpen } = useAppSelector((state) => state.menuActivoAdmin);

  const menuItems = {
    USUARIOS: [
      "Empleados",
      "Clientes", 
    ],
    PRODUCTOS: [
      "Catálogo",
      "Inventario", 
      "Precios",
    ],
    PEDIDOS: [
      "Órdenes de compra",
    ]
  };

  const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-');

  const handleMouseEnter = (menu: MenuSection) => {
    dispatch(setActiveMenu(menu));
  };

  const handleMouseLeave= ()=>{
    dispatch(setActiveMenu(null))
    dispatch(closeDropdown());
  }

  const handleSubMenuClick = (subMenu: string) => {
  dispatch(setActiveSubMenu(subMenu));
  dispatch(closeDropdown());

  const base = normalize(activeMenu!);
  const sub = normalize(subMenu);

  navigate(`/admin/${base}/${sub}`);
};

  return (
  <div className="w-full h-10 bg-gray-300 text-xl flex items-center justify-center gap-8 relative">
    {Object.keys(menuItems).map((menuName) => (
      <div
        key={menuName}
        className="relative"
        onMouseEnter={() => handleMouseEnter(menuName as MenuSection)}
        onMouseLeave={() => handleMouseLeave()}
      >
        <div
          className={`cursor-pointer transition-colors duration-260 px-4 py-2 ${
            activeMenu === menuName ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-500'
          }`}
        >
          <p className="font-medium">{menuName}</p>
        </div>

        {isDropdownOpen && activeMenu === menuName && (
          <div 
            className="absolute top-full left-0 -mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50"
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
