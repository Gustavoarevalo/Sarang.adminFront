export type OrderStatus =
  | 'paid'
  | 'received'
  | 'packed'
  | 'courier-pickup'
  | 'in-transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryMethod = 'pickup' | 'courier';

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
  status: OrderStatus;
  sendificoTracking?: string;
  courier?: string;
  address?: ShippingAddress;
  products: ProductSummary[];
};
