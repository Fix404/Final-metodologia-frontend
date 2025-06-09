import { Outlet, Link } from 'react-router-dom';
import { Footer } from '../components/ui/Footer';
import ClienteNavbar from '../components/ui/Navbar/ClienteNavbar';

export const MainLayout = () => {

  return (
    <div className="bg-gradient-to-b from-[#6DA4B9] to-[#fdfae8] flex flex-col min-h-screen">
      <ClienteNavbar />
 
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
