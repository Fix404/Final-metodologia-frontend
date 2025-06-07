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

export const AppRouter = () => {
    return (
        <Router>
            <Routes>

                {/* Rutas CON Navbar/Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/registro" element={<RegistroScreen />} />
                    <Route path="/carrito" element={<CarritoScreen />} />
                    <Route path="/productos" element={<CatalogoScreen />} />
                    <Route path="/productos/:id" element={<DetalleScreen />} />

                </Route>

                {/* Rutas SIN Navbar/Footer */}
                <Route path="/admin" element={
                    <div className="flex flex-col min-h-screen">
                        <div className="w-full bg-[#183B4E]">
                            <AdminNavBar />
                        </div>
                        <div >
                            <AdminSubNavBar />
                        </div>
                        <div>
                            <AdminScreen />
                        </div>
                    </div>
                } />

            </Routes>
        </Router>
    )
}
