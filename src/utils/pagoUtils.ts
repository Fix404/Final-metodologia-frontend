
export const calcularPrecioFinal = (item: any) => {
  const precioBase = item.precio.precioVenta;
  const descuento = item.producto.descuento?.porcentaje ?? 0;
  return Math.round(precioBase * (1 - descuento / 100));
};

export const calcularTotal = (items: any[]) => {
  return items.reduce((total, { detalle, cantidad }) => {
    return total + calcularPrecioFinal(detalle) * cantidad;
  }, 0);
};

export const generarCodigoPedido = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED-${timestamp}-${random}`;
};

export const copiarAlPortapapeles = (texto: string) => {
  navigator.clipboard.writeText(texto);
  // Aquí podrías mostrar un toast de confirmación
};