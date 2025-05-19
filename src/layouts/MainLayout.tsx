import { Outlet } from 'react-router-dom';
import { Footer } from '../components/ui/Footer';
import ClienteNavbar from '../components/ui/Navbar/ClienteNavbar';

export const MainLayout = () => {
  return (
    <>
      <ClienteNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};