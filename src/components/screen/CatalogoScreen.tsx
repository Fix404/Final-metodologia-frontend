import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ProductoCatalogoCardList } from "../ui/Lists/ProductoCatalogoCardList";
import { fetchProducto } from "../../redux/slices/productoSlice";
import { RootState } from "../../redux/store";
import { IProducto } from "../../types/IProducto";
import { IDetalle } from "../../types/IDetalle";
import { detalleService } from "../../services/detalleService";

interface ICategoria {
    id: number;
    nombre: string;
}

export const CatalogoScreen = () => {
    const productos = useSelector((state: RootState) => state.producto.productos);
    const dispatch = useDispatch();

    const [categorias, setCategorias] = useState<ICategoria[]>([]);
    const [categoria, setCategoria] = useState("");
    const [tipo, setTipo] = useState("");
    const [sexo, setSexo] = useState("");
    const [talle, setTalle] = useState(""); 
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [detalles, setDetalles] = useState<IDetalle[]>([]);
    const [tallesDisponibles, setTallesDisponibles] = useState<string[]>([]); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Traer productos
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8080/productos");
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

    // Traer detalles
    useEffect(() => {
        const fetchDetalles = async () => {
            try {
                const detallesData: IDetalle[] = await detalleService.obtenerDetallesActivos();
                setDetalles(detallesData);
                
                // Extraer talles únicos de los detalles
                const tallesUnicos = Array.from(
                    new Set(
                        detallesData
                            .filter((detalle) => detalle.talle?.talle) // Filtrar detalles que tienen talle
                            .map((detalle) => detalle.talle!.talle) // Extraer el string del talle
                    )
                ).sort(); // Orden alfabético simple
                
                setTallesDisponibles(tallesUnicos);
            } catch (err) {
                console.error("Error al obtener detalles:", err);
            }
        };

        fetchDetalles();
    }, []);

    // Traer categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await axios.get<ICategoria[]>("http://localhost:8080/categorias");
                setCategorias(res.data);
            } catch (err) {
                console.error("Error al obtener categorías:", err);
            }
        };

        fetchCategorias();
    }, []);

    // Función para verificar si un producto tiene al menos un detalle en el rango de precio
    const productoEnRangoPrecio = (productoId: number): boolean => {
        if (!precioMin && !precioMax) return true;

        const detallesProducto = detalles.filter(detalle => 
            detalle.producto?.id === productoId && detalle.precio
        );

        const min = precioMin ? parseFloat(precioMin) : 0;
        const max = precioMax ? parseFloat(precioMax) : Infinity;

        return detallesProducto.some(detalle => {
            const precio = detalle.precio!.precioVenta;
            return precio >= min && precio <= max;
        });
    };

    // Función para verificar si un producto tiene al menos un detalle con el talle seleccionado
    const productoConTalle = (productoId: number): boolean => {
        if (!talle) return true;

        return detalles.some(detalle => 
            detalle.producto?.id === productoId && 
            detalle.talle?.talle === talle
        );
    };

    // Filtrado de productos según filtros
    const filteredProducts = productos.filter((producto: IProducto) => {
        const matchesTipo = tipo ? producto.tipo!.toLowerCase() === tipo.toLowerCase() : true;
        const matchesSexo = sexo ? producto.sexoProducto!.toLowerCase() === sexo.toLowerCase() : true;
        const matchesCategoria = categoria
            ? producto.categoria?.id!.toString() === categoria
            : true;
        const matchesPrecio = productoEnRangoPrecio(producto.id!);
        const matchesTalle = productoConTalle(producto.id!); // Nueva validación de talle

        return matchesTipo && matchesSexo && matchesCategoria && matchesPrecio && matchesTalle;
    });

    const renderFiltro = (
        label: string,
        value: string,
        setValue: (v: string) => void
    ) =>
        value && (
            <div className="flex items-center gap-2 bg-[#1c4577]/10 text-[#1c4577] px-3 py-2 rounded-lg text-sm font-medium">
                <span>{label}: {value}</span>
                <button
                    onClick={() => setValue("")}
                    className="hover:bg-[#1c4577]/20 hover:cursor-pointer rounded-full p-1 transition-colors duration-200"
                    title="Limpiar filtro"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        );

    const renderFiltroPrecio = () => {
        if (!precioMin && !precioMax) return null;
        
        const rangoTexto = `$${precioMin || '0'} - $${precioMax || '∞'}`;
        
        return (
            <div className="flex items-center gap-2 bg-[#1c4577]/10 text-[#1c4577] px-3 py-2 rounded-lg text-sm font-medium">
                <span>Precio: {rangoTexto}</span>
                <button
                    onClick={() => {
                        setPrecioMin("");
                        setPrecioMax("");
                    }}
                    className="hover:bg-[#1c4577]/20 hover:cursor-pointer rounded-full p-1 transition-colors duration-200"
                    title="Limpiar filtro"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        );
    };

    const handlePrecioChange = (value: string, tipo: 'min' | 'max') => {
        // Solo permitir números y punto decimal
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value) || value === '') {
            if (tipo === 'min') {
                setPrecioMin(value);
            } else {
                setPrecioMax(value);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfae8]">
                <p className="text-gray-600">Cargando productos...</p>
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
        <div className="min-h-screen bg-[#ffffde]">
            <main className="container mx-auto px-4 pt-4 py-8 max-w-7xl">

                {/* FILTROS */}
                <div className="flex flex-wrap gap-6 mb-6">

                    {/* Filtro Categoría */}
                    <select
                        className="w-32 bg-white text-[#25374d] font-medium rounded-lg border border-[#adafb1] cursor-pointer px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        disabled={categorias.length === 0}
                    >
                        <option value="">Categoría</option>
                        {categorias.map(cat => (
                            <option
                                className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                                key={cat.id}
                                value={cat.id.toString()}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>

                    {/* Filtro Tipo */}
                    <select
                        className="w-32 bg-white text-[#25374d] font-medium rounded-lg border border-[#adafb1] hover:cursor-pointer px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value=""
                        >Tipo</option>
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="ropa"
                        >Ropa</option>
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="calzado"
                        >Calzado</option>
                    </select>

                    {/* Filtro Sexo */}
                    <select
                        className="w-32 bg-white text-[#25374d] font-medium rounded-lg border border-[#adafb1] hover:cursor-pointer px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                    >
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="">Sexo</option>
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="mujer">Mujer</option>
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="hombre">Hombre</option>
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="unisex">Unisex</option>
                    </select>

                    {/* Filtro Talle - NUEVO */}
                    <select
                        className="w-32 bg-white text-[#25374d] font-medium rounded-lg border border-[#adafb1] hover:cursor-pointer px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        value={talle}
                        onChange={(e) => setTalle(e.target.value)}
                        disabled={tallesDisponibles.length === 0}
                    >
                        <option
                            className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                            value="">Talle</option>
                        {tallesDisponibles.map(talleOption => (
                            <option
                                className="bg-white text-[#25374d] font-medium hover:bg-blue-100"
                                key={talleOption}
                                value={talleOption}>
                                {talleOption}
                            </option>
                        ))}
                    </select>

                    {/* Filtro Precio - Rango */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Min."
                            value={precioMin}
                            onChange={(e) => handlePrecioChange(e.target.value, 'min')}
                            className="w-20 bg-white text-[#25374d] font-medium rounded-lg border border-[#7c94aa] px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        />
                        <span className="text-[#25374d] font-medium">-</span>
                        <input
                            type="text"
                            placeholder="Max."
                            value={precioMax}
                            onChange={(e) => handlePrecioChange(e.target.value, 'max')}
                            className="w-20 bg-white text-[#25374d] font-medium rounded-lg border border-[#7c94aa] px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c4577] focus:ring-opacity-50 transition"
                        />
                    </div>

                    {/* Etiquetas de filtros activos */}
                    {renderFiltro("Tipo", tipo, setTipo)}
                    {renderFiltro("Sexo", sexo, setSexo)}
                    {renderFiltro("Talle", talle, setTalle)} {/* Nueva etiqueta para talle */}
                    {renderFiltro("Categoría", categoria ? categorias.find(c => c.id.toString() === categoria)?.nombre || "" : "", setCategoria)}
                    {renderFiltroPrecio()}

                </div>

                <ProductoCatalogoCardList productos={filteredProducts} />
            </main>
        </div>
    );
};