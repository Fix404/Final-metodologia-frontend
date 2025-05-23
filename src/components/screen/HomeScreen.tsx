import ProductoCatalogoCard from '../../components/ui/CardList/ProductoCatalogoCard'
import { IColor } from '../../types/IColor';
import { IDetalleProducto } from '../../types/IDetalleProducto';
import { IPrecio } from '../../types/IPrecio';
import { IProducto } from '../../types/IProducto';
import { ITalle } from '../../types/ITalle';

    const productos: IProducto[] = [
        { id: 1, name: "Zapatillas", description: "Calzado deportivo", category: "deportivo", type: "calzado", sex: "mujer", image: "" },
        { id: 2, name: "Conjunto", description: "Conjunto de invierno", category: "mujer", type: "ropa", sex: "mujer", image: "" },
        { id: 3, name: "Remera", description: "Remera casual", category: "infantil", type: "ropa", sex: "mujer", image: "" },
        { id: 4, name: "Pantalón deportivo", description: "Pantalón deportivo", category: "deportivo", type: "calzado", sex: "hombre", image: "" },
        { id: 5, name: "Remera estampada", description: "Remera con estampado", category: "mujer", type: "ropa", sex: "mujer", image: "" },
        { id: 6, name: "Zapatillas de lona", description: "Calzado casual", category: "hombre", type: "calzado", sex: "hombre", image: "" },
    ];

    const colores: IColor[] = [
        { id: 1, color: "Negro" },
        { id: 2, color: "Blanco" },
        { id: 3, color: "Rojo" },
    ];

    const talles: ITalle[] = [
        { id: 1, size: "S" },
        { id: 2, size: "M" },
        { id: 3, size: "L" },
    ];

    const precios: IPrecio[] = [
        { id: 1, purchasePrice: 7000, salePrice: 10000 },
        { id: 2, purchasePrice: 9000, salePrice: 12000 },
        { id: 3, purchasePrice: 6000, salePrice: 9500 },
        { id: 4, purchasePrice: 8000, salePrice: 11000 },
        { id: 5, purchasePrice: 8500, salePrice: 11500 },
        { id: 6, purchasePrice: 7500, salePrice: 10500 },
    ];

    const detalleProductos: IDetalleProducto[] = productos.map((producto, index) => ({
        id: index + 1,
        product: producto,
        price: precios[index],
        colors: [colores[index % colores.length]],
        size: talles[index % talles.length],
        stock: 10 + index,
        state: "activo",
    }));

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
        <h2 className="text-3xl font-bold mb-6 text-center">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {detalleProductos.map(producto => (
            <ProductoCatalogoCard key={producto.id} detalleProducto={producto}           
            />
          ))}
        </div>
      </section>
    </div>
  );
};