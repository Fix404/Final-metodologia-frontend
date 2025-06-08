import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminScreen } from './components/screen/AdminScreen';
import { AdminNavBar } from './components/ui/AdminNavBars/AdminNavBar';
import { AdminSubNavBar } from './components/ui/AdminNavBars/AdminSubNavBar';
import { HomeScreen } from './components/screen/HomeScreen';
import { MainLayout } from './layouts/MainLayout';
import { RegistroScreen } from './components/screen/RegistroScreen';
import { CatalogoScreen } from './components/screen/CatalogoScreen';
import DetalleScreen from './components/screen/DetalleScreen';
import { LoginScreen } from './components/screen/LoginScreen';
import { CarritoScreen } from './components/screen/CarritoScreen';
import ClienteNavbar from './components/ui/Navbar/ClienteNavbar';
import { TablaAdminClientes } from './components/ui/TablasAdmin/TablaAdminClientes';
import { TablaAdminEmpleados } from './components/ui/TablasAdmin/TablaAdminEmpleados';

export const AppRouter = () => {
    return (
        <Router>
            <Routes>

                {/*Landing Page sin Footer*/}
                <Route path="/" element={
                    <div className="flex flex-col min-h-screen">
                        <div className="w-full bg-[#183B4E]">
                            <ClienteNavbar />
                        </div>
                        <div>
                            <HomeScreen />
                        </div>
                    </div>
                } />

                {/* Rutas CON Navbar/Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/registro" element={<RegistroScreen />} />
                    <Route path="/carrito" element={<CarritoScreen />} />
                    <Route path="/productos" element={<CatalogoScreen />} />
                    <Route path="/productos/:id" element={<DetalleScreen />} />

                </Route>

        {/* Rutas SIN Navbar/Footer */}
        <Route
          path="/admin"
          element={
            <div className="flex flex-col min-h-screen">
              <div className="w-full bg-[#183B4E]">
                <AdminNavBar />
              </div>
              <div>
                <AdminSubNavBar />
              </div>
              <div>
                <AdminScreen />
              </div>
            </div>
          }
        />
        <Route
          path="/admin/usuarios/empleados"
          element={
            <div
              className="flex flex-col min-h-screen bg-[url('/logoDesaturado.png')] bg-no-repeat bg-center"
              style={{ backgroundSize: "385px auto",
                backgroundPosition: 'center 140px'
               }}
            >
              <div className="w-full bg-[#183B4E]">
                <AdminNavBar />
              </div>

              <div>
                <AdminSubNavBar />
              </div>

              <div className="flex-grow flex items-start justify-center px-4 py-15 z-6 relative">
                <TablaAdminEmpleados />
              </div>
            </div>
          }
        />
        <Route
          path="/admin/usuarios/clientes"
          element={
            <div
              className="flex flex-col min-h-screen bg-[url('/logoDesaturado.png')] bg-no-repeat bg-center"
              style={{ backgroundSize: "385px auto",
                backgroundPosition: 'center 140px'
               }}
            >
              <div className="w-full bg-[#183B4E]">
                <AdminNavBar />
              </div>

              <div>
                <AdminSubNavBar />
              </div>

              <div className="flex-grow flex items-start justify-center px-4 py-15 z-6 relative">
                <TablaAdminClientes />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
