import type { OrderStatus, StoreOrder } from '../types/orders';

export const orderStatusLabels: Record<OrderStatus, string> = {
  paid: 'Nuevo pedido',
  received: 'Pedido recibido',
  packed: 'Empaquetado',
  'courier-pickup': 'Courier retiró',
  'in-transit': 'En ruta',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const orderStatusFlow: OrderStatus[] = [
  'paid',
  'received',
  'packed',
  'courier-pickup',
  'in-transit',
  'delivered',
];

export const ordersSeed: StoreOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BR-1001',
    orderDate: '2026-05-30 09:15',
    deliveryMethod: 'courier',
    paymentMethod: 'Tarjeta',
    status: 'received',
    sendificoTracking: '89021',
    courier: 'Sendifico Express',
    address: {
      customerName: 'Camila Torres',
      phone: '099 234 7781',
      city: 'Guayaquil',
      neighborhood: 'Kennedy Norte',
      street: 'Av. Miguel H. Alcivar y Luis Orrantia',
      reference: 'Edificio esquinero, recepción planta baja',
    },
    products: [
      { id: 'prd-1', name: 'Crema Hidratante Rosa', quantity: 2, unitPrice: 18.75 },
      { id: 'prd-2', name: 'Lip Glow Rosa Suave', quantity: 1, unitPrice: 12.5 },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'BR-1002',
    orderDate: '2026-05-30 10:40',
    deliveryMethod: 'courier',
    paymentMethod: 'Transferencia',
    status: 'packed',
    sendificoTracking: '89022',
    courier: 'Sendifico Same Day',
    address: {
      customerName: 'Andrea Molina',
      phone: '098 112 5544',
      city: 'Quito',
      neighborhood: 'La Carolina',
      street: 'Av. República y Eloy Alfaro',
      reference: 'Casa blanca con puerta negra',
    },
    products: [
      { id: 'prd-3', name: 'Colageno Beauty Mix', quantity: 1, unitPrice: 34.99 },
      { id: 'prd-4', name: 'Serum Vitamina C', quantity: 1, unitPrice: 22 },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'BR-1003',
    orderDate: '2026-05-29 11:08',
    deliveryMethod: 'courier',
    paymentMethod: 'Payphone',
    status: 'in-transit',
    sendificoTracking: '89023',
    courier: 'Sendifico Nacional',
    address: {
      customerName: 'Daniela Paredes',
      phone: '096 889 2100',
      city: 'Cuenca',
      neighborhood: 'El Vergel',
      street: 'Calle de las Herrerías 4-70',
      reference: 'Frente a cafetería, timbre 2',
    },
    products: [
      { id: 'prd-5', name: 'Paleta Soft Nude', quantity: 1, unitPrice: 29 },
      { id: 'prd-6', name: 'Vitaminas Hair & Nails', quantity: 2, unitPrice: 27.25 },
    ],
  },
  {
    id: 'ord-1004',
    orderNumber: 'BR-1004',
    orderDate: '2026-04-18 16:22',
    deliveryMethod: 'courier',
    paymentMethod: 'Tarjeta',
    status: 'delivered',
    sendificoTracking: '88990',
    courier: 'Sendifico Nacional',
    address: {
      customerName: 'Paula Rivas',
      phone: '099 450 6712',
      city: 'Manta',
      neighborhood: 'Barbasquillo',
      street: 'Calle Umiña y Av. Flavio Reyes',
      reference: 'Conjunto privado, garita principal',
    },
    products: [
      { id: 'prd-1', name: 'Crema Hidratante Rosa', quantity: 1, unitPrice: 18.75 },
      { id: 'prd-4', name: 'Serum Vitamina C', quantity: 1, unitPrice: 22 },
    ],
  },
];
