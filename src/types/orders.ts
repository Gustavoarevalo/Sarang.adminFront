export type OrderStatus =
  | 'paid'
  | 'received'
  | 'packed'
  | 'courier-pickup'
  | 'in-transit'
  | 'delivered';

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

export type StoreOrder = {
  id: string;
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
