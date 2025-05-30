import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminScreen } from './components/screen/AdminScreen';
import { AdminNavBar } from './components/ui/AdminNavBars/AdminNavBar';
import { AdminSubNavBar } from './components/ui/AdminNavBars/AdminSubNavBar';
import { LogInScreen } from './components/screen/LogInScreen';
import { HomeScreen } from './components/screen/HomeScreen';
import { MainLayout } from './layouts/MainLayout';
import { RegistroScreen } from './components/screen/RegistroScreen';
import { CatalogoScreen } from './components/screen/CatalogoScreen';
import DetalleScreen from './components/screen/DetalleScreen';

export const AppRouter = () => {
    return (
        <Router>
            <Routes>

                {/* Rutas CON Navbar/Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<LogInScreen />} />
                    <Route path="/login" element={<LogInScreen />} />
                    <Route path="/registro" element={<RegistroScreen />} />
                    <Route path="/galeria" element={<CatalogoScreen />} />
                    <Route path="/producto/:id" element={<DetalleScreen />} />
                </Route>

                {/* Rutas SIN Navbar/Footer */}
                <Route path="/admin" element={
                    <div className="flex flex-col min-h-screen">
                        <div className="w-full bg-[#183B4E] -mt-16">
                            <AdminNavBar />
                        </div>
                        <div className="w-full bg-[#183B4E] -mt-1">
                            <AdminSubNavBar />
                        </div>
                        <div className="-py-8">
                            <AdminScreen />
                        </div>
                    </div>
                } />

            </Routes>
        </Router>
    )
}

/* <Router>
            <div className="flex flex-col min-h-screen">

                <main className="flex-grow container mx-auto py-8 px-4">
                    <Routes>
                        <Route path="/" element={
                            <div className="flex flex-col min-h-screen">
                                <Navbar logo="/images/reactors-logo.png" />
                                <HomeScreen />

                            </div>
                        } />
                        <Route path="/login" element={<LoginScreen />} />
                    </Routes>
                </main>

                <Routes>
                    <Route path="/admin" element={
                        <div className="flex flex-col min-h-screen">
                            <div className="w-full bg-[#183B4E] -mt-16">
                                <AdminNavBar />
                            </div>
                            <div className="w-full bg-[#183B4E] -mt-1">
                                <AdminSubNavBar />
                            </div>
                            <div className="-py-8">
                                <AdminScreen />
                            </div>
                        </div>
                    } />
                </Routes>
                
                <Footer />
            </div>
        </Router> */