import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ProductoDestacadoCard } from "../ui/CardList/ProductoDestacadoCard";
import { fetchProducto } from "../../redux/slices/productoSlice";
import styles from "./HomeScreen.module.css";
import imglustrativa from '../../images/G97977_F_beauty_B2C-removebg-preview.png';
import { Link } from "react-router-dom";

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const productos = useSelector((state: RootState) => state.producto.productos);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8080/productos");
        dispatch(fetchProducto(response.data));
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-[#DDA853] pb-10">
      {/* Hero Section */}
      <section className=" flex flex-row items-center justify-center text-white p-8 mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-128 md:mb-0">
            <h1 className="text-5xl font-bold mb-4">¡ATREVETE A MARCAR LA DIFERENCIA!</h1>
            <p className="text-3xl mb-8">¡Aprovechá las ofertas exclusivas que tenemos para vos!</p>
            <Link
              to="/productos"
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100 hover:cursor-pointer transition-colors">
              ¡Comprar ahora!
            </Link>
          </div>

        </div>
        <div className="flex justify-center p-0">
          <img
            src={imglustrativa}
            alt="Zapatilla deportiva"
            className="max-w-xs md:max-w-sm"
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl text-neutral-900 font-bold mb-8 text-left ml-8">PRODUCTOS DESTACADOS</h2>

        {loading && <p className="ml-8">Cargando productos...</p>}
        {error && <p className="ml-8 text-red-500">Error: {error}</p>}

        <div className={`relative px-4 mb-4`}>
          <div className={`flex overflow-visible space-x-8 ${styles.ocultarScrollbar}`}>
            {productos.map((producto) => (
              <ProductoDestacadoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};
