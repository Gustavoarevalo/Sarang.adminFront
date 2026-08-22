import { EnumEstadoPedido, EnumMetodoEntrega } from '../api/Controller/Pedidos/InterfacePedidos';
import type { IPedidoAdminDto } from '../api/Controller/Pedidos/InterfacePedidos';
import type { OrderStatus, StoreOrder } from '../types/orders';

const estadoToStatus: Record<EnumEstadoPedido, OrderStatus> = {
  [EnumEstadoPedido.Paid]: 'paid',
  [EnumEstadoPedido.Received]: 'received',
  [EnumEstadoPedido.Packed]: 'packed',
  [EnumEstadoPedido.CourierPickup]: 'courier-pickup',
  [EnumEstadoPedido.InTransit]: 'in-transit',
  [EnumEstadoPedido.Delivered]: 'delivered',
  [EnumEstadoPedido.Cancelled]: 'cancelled',
};

const statusToEstado: Record<OrderStatus, EnumEstadoPedido> = {
  paid: EnumEstadoPedido.Paid,
  received: EnumEstadoPedido.Received,
  packed: EnumEstadoPedido.Packed,
  'courier-pickup': EnumEstadoPedido.CourierPickup,
  'in-transit': EnumEstadoPedido.InTransit,
  delivered: EnumEstadoPedido.Delivered,
  cancelled: EnumEstadoPedido.Cancelled,
};

export function toOrderStatus(estado: EnumEstadoPedido): OrderStatus {
  return estadoToStatus[estado] ?? 'paid';
}

export function toEstadoPedido(status: OrderStatus): EnumEstadoPedido {
  return statusToEstado[status] ?? EnumEstadoPedido.Paid;
}

/** "2026-05-30T09:15:00" -> "2026-05-30 09:15" (formato que espera filterOrdersByPeriod). */
function formatOrderDate(fecha: string): string {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  const pad = (value: number) => String(value).padStart(2, '0');
  //prettier-ignore
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function mapPedidoToStoreOrder(pedido: IPedidoAdminDto): StoreOrder {
  return {
    id: `ped-${pedido.idPedidoEntitys}`,
    idPedido: pedido.idPedidoEntitys,
    orderNumber: pedido.numeroPedido,
    orderDate: formatOrderDate(pedido.fechaPedido),
    deliveryMethod: pedido.metodoEntrega === EnumMetodoEntrega.Pickup ? 'pickup' : 'courier',
    paymentMethod: pedido.metodoPago,
    status: toOrderStatus(pedido.estadoPedido),
    sendificoTracking: pedido.tracking ?? undefined,
    courier: pedido.courier ?? undefined,
    totals: {
      subtotal: pedido.subtotalSinIva,
      iva: pedido.ivaTotal,
      shipping: pedido.envioTotal,
      total: pedido.total,
    },
    address: pedido.direccion
      ? {
          customerName: pedido.direccion.clienteNombre,
          phone: pedido.direccion.telefono,
          city: pedido.direccion.ciudad,
          neighborhood: pedido.direccion.barrio,
          street: pedido.direccion.calle,
          reference: pedido.direccion.referencia,
          latitude: pedido.direccion.latitud ?? undefined,
          longitude: pedido.direccion.longitud ?? undefined,
        }
      : undefined,
    products: pedido.items.map((item) => ({
      id: String(item.idPedidoItemEntitys),
      name: item.nombre,
      quantity: item.cantidad,
      unitPrice: item.precioUnitario,
    })),
  };
}
