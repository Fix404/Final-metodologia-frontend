import { Outlet } from 'react-router-dom';
import { Footer } from '../components/ui/Footer';
import ClienteNavbar from '../components/ui/Navbar/ClienteNavbar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ProductoCatalogoCard from '../components/ui/CardList/ProductoCatalogoCard';

export const MainLayout = () => {

  const productos = useSelector((state: RootState) => state.detalleProducto.productos);
  const textoBusqueda = useSelector((state: RootState) => state.busqueda.texto.toLowerCase());

  const resultados = productos.filter((p) =>
    p.producto.nombre.toLowerCase().includes(textoBusqueda)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <ClienteNavbar />
      
      {/* 
      {textoBusqueda !== '' && (
        <div className="p-4 bg-white shadow-md z-50 relative">
          <h2 className="text-lg font-semibold mb-2">Resultados de búsqueda:</h2>
          {resultados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {resultados.map((producto) => (
                <ProductoCatalogoCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}
        */}

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
