import { SetStateAction, useEffect, useState } from "react";
import { ProductoCatalogoCardList } from "../ui/Lists/ProductoCatalogoCardList";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IProducto } from "../../types/IProducto";
import { fetchProducto } from "../../redux/slices/productoSlice";
import { RootState } from "../../redux/store";

export const CatalogoScreen = () => {

    const productos = useSelector((state: RootState) => state.producto.productos);
    const dispatch = useDispatch();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get("http://localhost:8080/productos");
                console.log("Productos desde la API:", response.data);
                dispatch(fetchProducto(response.data));
            } catch (err) {
                console.error("Error al obtener productos:", err);
                setError("Error al cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [dispatch]);

    // Filtro
    const filteredProducts: IProducto[] = selectedCategory
        ? productos.filter((producto: IProducto) => producto.categoria.nombre.toLowerCase() === selectedCategory)
        : productos;

    const handleCategoryChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSelectedCategory(event.target.value);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfae8]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfae8]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen left-0 right-0 bg-[#fcfcd3]">
            <main className="container mx-auto px-4 pt-4 py-8 max-w-7xl">

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full mb-5 sm:w-auto">

                    <div className="relative group">
                        <select
                            className="appearance-none bg-white/90 border-2 border-gray-200 hover:border-[#1c4577] focus:border-[#1c4577] focus:ring-4 focus:ring-[#1c4577]/10 focus:outline-none rounded-xl px-4 py-3 pr-10 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-w-[200px]"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Todas las categorías</option>
                            <option value="mujer">Mujer</option>
                            <option value="hombre">Hombre</option>
                            <option value="infantil">Infantil</option>
                        </select>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1c4577] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {selectedCategory && (
                        <div className="flex items-center gap-2 bg-[#1c4577]/10 text-[#1c4577] px-3 py-2 rounded-lg text-sm font-medium">
                            <span>Filtro activo</span>
                            <button
                                onClick={() => setSelectedCategory('')}
                                className="hover:bg-[#1c4577]/20 rounded-full p-1 transition-colors duration-200"
                                title="Limpiar filtro"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <ProductoCatalogoCardList productos={filteredProducts} />
            </main>
        </div>

    );
};
