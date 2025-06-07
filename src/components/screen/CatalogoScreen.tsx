import { SetStateAction, useEffect, useState } from "react";
import { ProductoCatalogoCardList } from "../ui/Lists/ProductoCatalogoCardList";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchDetalleProducto } from "../../redux/slices/detalleProductoSlice";
import { IDetalle } from "../../types/IDetalle";
import { IPrecio } from "../../types/IPrecio";
import { ITalle } from "../../types/ITalle";
import { IColor } from "../../types/IColor";
import { IProducto } from "../../types/IProducto";
import { IImagen } from "../../types/IImagen";
import { ICategoria } from "../../types/ICategoria";

export const CatalogoScreen = () => {

   /* const mockImagen: IImagen = {
        id: 1, url: "https://tse4.mm.bing.net/th?id=OIP.wqwEufidl9MOIHra1Gc-CgHaHa&pid=Api", altDescripcion: ""
    }

    const mockCategoria: ICategoria[] = [
        { id: 1, nombre: "mujer", },
        { id: 2, nombre: "hombre", },
        { id: 3, nombre: "infantil", },
        { id: 4, nombre: "deportivo" }
    ]

    const productos: IProducto[] = [
        { id: 1, nombre: "Zapatillas", descripcion: "Calzado deportivo", categoria: mockCategoria[0], tipo: "calzado", sexoProducto: "mujer", imagen: mockImagen },
        { id: 3, nombre: "Remera", descripcion: "Remera casual", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria[0], imagen: mockImagen },
        { id: 4, nombre: "Pantalón deportivo", descripcion: "Pantalón deportivo", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria[1], imagen: mockImagen },
        { id: 5, nombre: "Remera estampada", descripcion: "Remera con estampado", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria[2], imagen: mockImagen },
        { id: 6, nombre: "Zapatillas de lona", descripcion: "Calzado casual", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria[3], imagen: mockImagen },
        { id: 7, nombre: "Zapatillas", descripcion: "Calzado deportivo", categoria: mockCategoria[0], tipo: "calzado", sexoProducto: "mujer", imagen: mockImagen },
        { id: 8, nombre: "Remera", descripcion: "Remera casual", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria[0], imagen: mockImagen },
        { id: 9, nombre: "Pantalón deportivo", descripcion: "Pantalón deportivo", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria[1], imagen: mockImagen },
        { id: 10, nombre: "Remera estampada", descripcion: "Remera con estampado", tipo: "ropa", sexoProducto: "mujer", categoria: mockCategoria[2], imagen: mockImagen },
        { id: 11, nombre: "Zapatillas de lona", descripcion: "Calzado casual", tipo: "calzado", sexoProducto: "hombre", categoria: mockCategoria[3], imagen: mockImagen },
    ];

    const colores: IColor[] = [
        { id: 1, color: "Rojo" },
        { id: 1, color: "Negro" },
        { id: 1, color: "Blanco" }
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
        color: colores[1],
        talle: talles[2],
        stock: 10 + index,
        estado: "activo",
    }));*/

 
    //Redux
    const productos = useSelector((state: any) => state.detalleProducto.productos);

    const dispatch = useDispatch();

    // Filtros
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get("http://localhost:8080/detalle");
                console.log("Productos desde la API:", response.data);
                dispatch(fetchDetalleProducto(response.data));
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
    const filteredProducts: IDetalle[] = selectedCategory
        ? productos.filter((detalle: IDetalle) => detalle.producto.categoria.nombre === selectedCategory)
        : productos;

    const handleCategoryChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSelectedCategory(event.target.value);
    };

    // Cargando
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

    // Error
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
        <div className="min-h-screen left-0 right-0 bg-[#fdfae8]">
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
                            <option value="deportivo">Deportivo</option>
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
