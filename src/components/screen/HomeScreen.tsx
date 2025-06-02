import ProductoCatalogoCard from '../../components/ui/CardList/ProductoCatalogoCard'
import { ICategoria } from '../../types/ICategoria';
import { IColor } from '../../types/IColor';
import { IDetalle } from '../../types/IDetalle';
import { IImagen } from '../../types/IImagen';
import { IPrecio } from '../../types/IPrecio';
import { IProducto } from '../../types/IProducto';
import { ITalle } from '../../types/ITalle';


const mockImagen: IImagen = {
  id: 1, url: "https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api", altDescripcion: ""
}

const mockCategoria: ICategoria = {
  id:1, nombre: "categoría"
}

const productos: IProducto[] = [
  { id: 1, nombre: "Zapatillas", descripcion: "Calzado deportivo", categoria: mockCategoria ,tipo: "calzado", sexoProducto: "mujer", imagen: mockImagen},
  { id: 3, nombre: "Remera", descripcion: "Remera casual", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria, imagen: mockImagen },
  { id: 4, nombre: "Pantalón deportivo", descripcion: "Pantalón deportivo", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria, imagen: mockImagen },
  { id: 5, nombre: "Remera estampada", descripcion: "Remera con estampado", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria, imagen: mockImagen },
  { id: 6, nombre: "Zapatillas de lona", descripcion: "Calzado casual", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria, imagen: mockImagen },
];

const colores: IColor[] = [
  { id: 1, color: "Rojo" },
  { id: 2, color: "Negro" },
  { id: 3, color: "Blanco" }
]

const talles: ITalle[] = [
  { id: 1, talle: "S" },
  { id: 2, talle: "M" },
  { id: 3, talle: "L" },
];



const precios: IPrecio[] = [
  { id: 1, precioCompra: 7000, precioVenta: 10000 },
  { id: 2, precioCompra: 9000, precioVenta: 12000 },
  { id: 3, precioCompra: 6000, precioVenta: 9500 },
  { id: 4, precioCompra: 8000, precioVenta: 11000 },
  { id: 5, precioCompra: 8500, precioVenta: 11500 },
  { id: 6, precioCompra: 7500, precioVenta: 10500 },
];

const detalleProductos: IDetalle[] = productos.map((producto, index) => ({
  id: index + 1,
  producto: producto,
  precio: precios[index],
  color: [colores[index % colores.length]],
  talle: [talles[index % talles.length]],
  stock: 10 + index,
  estado: "activo",
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