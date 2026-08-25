/** Espejo de EnumEstadoPedido del backend. "verificando" es el estado con el que nace
 *  un pedido pagado por transferencia, hasta que la tienda valida el comprobante. */
export type OrderStatus = 'verificando' | 'iniciado' | 'despachado' | 'cancelado';

export type DeliveryMethod = 'pickup' | 'courier';

/** Como se pago el pedido. Espejo de EnumMetodoPago del backend. */
export type PaymentType = 'tarjeta' | 'transferencia';

export type ProductSummary = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type ShippingAddress = {
  customerName: string;
  phone: string;
  city: string;
  neighborhood: string;
  street: string;
  reference: string;
  latitude?: number;
  longitude?: number;
};

/** Totales que ya vienen calculados desde el backend (pedido real de la tienda). */
export type OrderTotals = {
  subtotal: number;
  iva: number;
  shipping: number;
  total: number;
};

export type StoreOrder = {
  id: string;
  /** Id en la base. Solo lo tienen los pedidos que vienen de la tienda. */
  idPedido?: number;
  totals?: OrderTotals;
  orderNumber: string;
  orderDate: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: string;
  /** Metodo normalizado, para filtrar sin depender de como este escrito paymentMethod. */
  paymentType?: PaymentType;
  /** Ticket de la pasarela (Kushki). Solo lo tienen los pedidos pagados con tarjeta. */
  ticketNumber?: string;
  status: OrderStatus;
  sendificoTracking?: string;
  courier?: string;
  /** Comprobante de la transferencia, para validarla antes de pasar el pedido a Iniciado. */
  comprobanteUrl?: string;
  address?: ShippingAddress;
  products: ProductSummary[];
};
