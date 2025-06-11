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

  const productosConDescuentoActivo = productos.filter(producto => {
    return producto.descuento &&
      producto.descuento !== null &&
      producto.activo && 
      new Date() >= new Date(producto.descuento.fechaInicio) &&
      new Date() <= new Date(producto.descuento.fechaFin);
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-[#DDA853] max-xs:pb-6 pb-2">

      {/* Seccion principal */}
      <section className="flex flex-row items-center justify-center text-white pt-16 mb-4  max-sm:pt-0">
        <div className="flex flex-row items-start max-w-screen-lg flex-wrap max-xs:flex-col max-sm:p-8 max-xs:items-center max-sm:flex-row max-sm:justify-between">
          <div className="max-w-lg max-xs:w-full max-xs:px-4 max-sm:w-2/3 max-sm:px-6">
            <h1 className="text-5xl font-bold mb-4 w-full max-xs:text-3xl max-sm:text-4xl">
              ¡ATREVETE A MARCAR LA DIFERENCIA!
            </h1>
            <p className="text-3xl mb-8 w-full max-xs:text-[17px] max-sm:text-[20px]">
              ¡Aprovechá las ofertas exclusivas que tenemos para vos!
            </p>

            <Link
              to="/productos"
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100 hover:cursor-pointer transition-colors max-xs:px-4 max-xs:py-2 max-sm:px-5 max-sm:py-3">
              ¡Comprar ahora!
            </Link>
          </div>

          <div className="flex justify-center max-xs:mt-4 max-xs:mb-6 max-sm:w-1/3 max-sm:mt-0">
            <img
              src={imglustrativa}
              alt="Zapatilla deportiva"
              className="max-w-xs md:max-w-sm max-xs:w-11/12 max-sm:w-full"
            />
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section>
        <h2 className="text-3xl text-neutral-900 font-bold mt-10 text-left ml-8 max-xs:text-left max-xs:mb-4 max-xs:ml-4 max-sm:text-left max-sm:ml-6">PRODUCTOS EN PROMOCIÓN</h2>
        {loading && <p className="ml-8 max-xs:text-left max-xs:ml-4 max-sm:text-left max-sm:ml-6">Cargando productos...</p>}
        {error && <p className="ml-8 text-red-500 max-xs:text-left max-xs:ml-4 max-sm:text-left max-sm:ml-6">Error: {error}</p>}

        <div className={`${styles.scrollContainer}`}>
          <div className={`${styles.cardsHorizontal}`}>
            {productosConDescuentoActivo.map(producto => (
              <ProductoDestacadoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};