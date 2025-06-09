export type MetodoPago = "transferencia" | "mercadopago";

export interface DatosTransferencia {
  banco: string;
  titular: string;
  cbu: string;
  alias: string;
}