import { useAppSelector } from "../../hooks/redux";


export const AdminScreen = () => {
  const { activeMenu} = useAppSelector((state) => state.menuActivoAdmin);
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
      {activeMenu==="USUARIOS" && <div className="">
        <h1>Bienvenido a administración</h1>
      </div>}
  </div>
    </div>
  );
};