import { SetStateAction, useState } from "react";
import { IProducto } from "../../types/IProducto";
import { IDetalleProducto } from "../../types/IDetalleProducto";
import { IPrecio } from "../../types/IPrecio";
import { ITalle } from "../../types/ITalle";
import { IColor } from "../../types/IColor";
import { ProductoCatalogoCardList } from "../ui/Lists/ProductoCatalogoCardList";

export const CatalogoScreen = () => {

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

    // Talles disponibles
    const talles: ITalle[] = [
        { id: 1, size: "S" },
        { id: 2, size: "M" },
        { id: 3, size: "L" },
    ];

    // Precios para cada producto (de ejemplo)
    const precios: IPrecio[] = [
        { id: 1, purchasePrice: 7000, salePrice: 10000 },
        { id: 2, purchasePrice: 9000, salePrice: 12000 },
        { id: 3, purchasePrice: 6000, salePrice: 9500 },
        { id: 4, purchasePrice: 8000, salePrice: 11000 },
        { id: 5, purchasePrice: 8500, salePrice: 11500 },
        { id: 6, purchasePrice: 7500, salePrice: 10500 },
    ];

    // Creamos detalleProductos con todos los datos necesarios
    const detalleProductos: IDetalleProducto[] = productos.map((producto, index) => ({
        id: index + 1,
        product: producto,
        price: precios[index],
        colors: [colores[index % colores.length]],
        size: talles[index % talles.length],
        stock: 10 + index,
        state: "activo",
    }));

    const [selectedCategory, setSelectedCategory] = useState("");
    const filteredProducts: IDetalleProducto[] = selectedCategory
        ? detalleProductos.filter(detalle => detalle.product.category === selectedCategory)
        : detalleProductos;

    const handleCategoryChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedCategory(event.target.value);
    };

    return (

        <div className="min-h-s0 left-0 right-0">
            <main className="container mx-auto px-4 py-8 max-w-7xl">

                <div className="ml-4">
                    <select
                        className="border border-gray-600 focus:border-gray-800 focus:ring-0 focus:outline-none rounded-md mb-4 p-1.5"
                        defaultValue=""
                        onChange={handleCategoryChange}
                    >
                        <option value="" disabled>Seleccionar categoría...</option>
                        <option value="mujer">Mujer</option>
                        <option value="hombre">Hombre</option>
                        <option value="infantil">Infantil</option>
                        <option value="deportivo">Deportivo</option>
                    </select>
                </div>
                <ProductoCatalogoCardList productos={filteredProducts} />

            </main>
        </div>
    )
}