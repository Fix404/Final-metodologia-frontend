import ProductoCatalogoCard from '../../components/ui/CardList/ProductoCatalogoCard'

const mockProducts = [
  {
    id: 1,
    name: 'Crocs',
    price: 3499.99,
    image: '/images/zapasAzules.jpg',
    colors: ['Marrón', 'Negro', 'Azul'],
    size: '40-45'
  },
  {
    id: 2,
    name: 'Reactors Running',
    price: 7999.99,
    image: '/images/images.png',
    colors: ['Celeste/Rojo', 'Negro/Blanco'],
    size: '38-44',
    discount: 15
  },
  {
    id: 3,
    name: 'Zapatillas Urban',
    price: 5999.99,
    image: '/images/images.png',
    colors: ['Gris', 'Negro', 'Blanco'],
    size: '36-45'
  },
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
        <h2 className="text-3xl font-bold mb-6 text-center">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map(product => (
            <ProductoCatalogoCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              size={product.size}
              colors={product.colors}
              discount={product.discount}
            />
          ))}
        </div>
      </section>
    </div>
  );
};