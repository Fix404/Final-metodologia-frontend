import { ICategoria } from '../../types/ICategoria';
import { IImagen } from '../../types/IImagen';
import { IProducto } from '../../types/IProducto';
import { ProductoDestacadoCard } from '../ui/CardList/ProductoDestacadoCard';
import styles from './HomeScreen.module.css'

const mockImagen: IImagen = {
  id: 1, url: "https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api", altDescripcion: ""
}

const mockCategoria: ICategoria = {
  id: 1, nombre: "categoría"
}

const productos: IProducto[] = [
  { id: 1, nombre: "Zapatillas", descripcion: "Calzado deportivo", categoria: mockCategoria, tipo: "calzado", sexoProducto: "mujer", imagen: mockImagen },
  { id: 3, nombre: "Remera", descripcion: "Remera casual", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria, imagen: mockImagen },
  { id: 4, nombre: "Pantalón deportivo", descripcion: "Pantalón deportivo", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria, imagen: mockImagen },
  { id: 5, nombre: "Remera estampada", descripcion: "Remera con estampado", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria, imagen: mockImagen },
  { id: 6, nombre: "Zapatillas de lona", descripcion: "Calzado casual", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria, imagen: mockImagen },
];

export const HomeScreen: React.FC = () => {
  return (
    <div>
      {/* Hero Section - Using the design from your landing page */}
      <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">¡ATREVETE A MARCAR LA DIFERENCIA!</h1>
            <p className="text-xl mb-6">¡Aprovechá las ofertas exclusivas que tenemos para vos!</p>
            <button className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">
              ¡Comprar ahora!
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/featured-shoe.png"
              alt="Featured Shoe"
              className="max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-left ml-8">PRODUCTOS DESTACADOS</h2>
        <div className= {`flex overflow-x-auto space-x-8 px-4 mb-6 ${styles.ocultarScrollbar}`}>
          {productos.map(producto => (
            <ProductoDestacadoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </div>
  );
};