import { LuSettings2 } from "react-icons/lu";
import { TablaAdmin } from "../ui/TablasAdmin/TablaAdmin";

export const AdminScreen = () => {
  return (
    <div className="flex flex-col items-center relative">
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
    </div>
  )
}
