import { LuSettings2 } from "react-icons/lu";
import { TablaAdmin } from "../ui/TablasAdmin/TablaAdmin";
import { MdOutlineSearch } from "react-icons/md";

export const AdminScreen = () => {
  const activemenu="USUARIOS"
  return (<>
  {activeMenu && <div className="flex flex-col items-center relative">
      <div className="mt-8 text-2xl">
        <h1>CLIENTES</h1>
      </div>
        <div className="mt-4 flex flex-row items-center gap-2 border-gray-700 shadow-sm p-2 rounded-2xl absolute left-68 top-22 bg-gray-200">
          <LuSettings2 />
          <p>NOMBRE DE CLASE</p>
        </div>
        <div className="mt-4 flex flex-row items-center gap-2 border-gray-700 shadow-sm p-2 rounded-2xl absolute right-68 w-50 top-22 bg-gray-200">
        <MdOutlineSearch />
        </div>
        <div className="mt-30">
          <TablaAdmin />
        </div>
    </div>}
  </>
  
    
  )
}
