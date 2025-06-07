import { LuSettings2 } from "react-icons/lu";
import { useAppSelector } from "../../hooks/redux";
import { TablaAdmin } from "../ui/TablasAdmin/TablaAdmin";


export const AdminScreen = () => {
  const { activeMenu, activeSubMenu} = useAppSelector((state) => state.menuActivoAdmin);
  return (
    <div className="w-full min-h-screen text-xl flex items-center justify-center gap-8 relative flex-col">
      <div 
    className="absolute inset-0 -z-20"
    style={{
      backgroundImage: 'url(/logoDesaturado.png)',
      backgroundSize: '385px auto',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
  <div className="relative z-10">
    {!activeMenu && <div className="">
        <h1>Bienvenido a administración</h1>
      </div>}
      {activeMenu==="USUARIOS" && activeSubMenu==="Clientes" && <div className="">
        <div className="mt-8 text-2xl">
        <h1>CLIENTES</h1>
      </div>
        <div className="mt-4 flex flex-row items-center gap-2 border-gray-700 shadow-sm p-2 rounded-2xl absolute left-68 top-22">
          <LuSettings2 />
          <p>NOMBRE DE CLASE</p>
        </div>
        <div className="mt-30">
          <TablaAdmin />
        </div>
      </div>}
  </div>
    </div>
  );
};