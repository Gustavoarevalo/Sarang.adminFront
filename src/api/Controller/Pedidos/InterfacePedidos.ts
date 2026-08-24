/** Espejo de EnumEstadoPedido del backend. */
export enum EnumEstadoPedido {
  Iniciado = 1,
  Despachado = 2,
  Cancelado = 3,
}

export enum EnumMetodoEntrega {
  Pickup = 1,
  Courier = 2,
}

export interface IPedidoItemAdminDto {
  idPedidoItemEntitys: number;
  idProductsEntitys: number | null;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  totalLinea: number;
}

export interface IPedidoDireccionAdminDto {
  clienteNombre: string;
  telefono: string;
  ciudad: string;
  barrio: string;
  calle: string;
  referencia: string;
  latitud?: number | null;
  longitud?: number | null;
}

export interface IPedidoAdminDto {
  idPedidoEntitys: number;
  numeroPedido: string;
  fechaPedido: string;
  clienteNombre: string;
  clienteTelefono?: string | null;
  metodoEntrega: EnumMetodoEntrega;
  metodoPago: string;
  estadoPedido: EnumEstadoPedido;
  subtotalSinIva: number;
  ivaTotal: number;
  descuentoTotal: number;
  envioTotal: number;
  total: number;
  courier?: string | null;
  tracking?: string | null;
  direccion?: IPedidoDireccionAdminDto | null;
  items: IPedidoItemAdminDto[];
}

export interface IFilterPedidosAdminDto {
  estado?: EnumEstadoPedido | null;
  desde?: string | null;
  hasta?: string | null;
  skip: number;
  take: number;
}

export interface IActualizarPedidoDto {
  idPedidoEntitys: number;
  estadoPedido?: EnumEstadoPedido;
  courier?: string;
  tracking?: string;
  observacion?: string;
}
