import type { StoreOrder } from '../types/orders';
import type { OrderDateRange, OrderPeriodFilter } from '../types/period';

export const orderPeriodLabels: Record<OrderPeriodFilter, string> = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes',
  range: 'Rango',
};

export const orderPeriodMetricLabels: Record<OrderPeriodFilter, string> = {
  today: 'Pedidos de hoy',
  week: 'Pedidos de la semana',
  month: 'Pedidos del mes',
  range: 'Pedidos por rango',
};

export const orderPeriodOptions: OrderPeriodFilter[] = ['today', 'week', 'month', 'range'];

export function filterOrdersByPeriod(
  orders: StoreOrder[],
  period: OrderPeriodFilter,
  range: OrderDateRange,
  currentDate = new Date(),
) {
  if (period === 'range') {
    return filterOrdersByRange(orders, range);
  }

  const fromDate = getStartDate(period, currentDate);
  const toDate = endOfDay(currentDate);

  return orders.filter((order) => {
    const orderDate = parseOrderDate(order.orderDate);
    return orderDate >= fromDate && orderDate <= toDate;
  });
}

function filterOrdersByRange(orders: StoreOrder[], range: OrderDateRange) {
  if (!range.from || !range.to) {
    return orders;
  }

  const fromDate = parseDateOnly(range.from);
  const toDate = endOfDay(parseDateOnly(range.to));

  return orders.filter((order) => {
    const orderDate = parseOrderDate(order.orderDate);
    return orderDate >= fromDate && orderDate <= toDate;
  });
}

function getStartDate(period: Exclude<OrderPeriodFilter, 'range'>, currentDate: Date) {
  if (period === 'today') {
    return startOfDay(currentDate);
  }

  if (period === 'week') {
    return startOfWeek(currentDate);
  }

  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
}

function parseOrderDate(value: string) {
  return new Date(value.replace(' ', 'T'));
}

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00`);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const mondayDistance = day === 0 ? -6 : 1 - day;
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() + mondayDistance);
  return monday;
}
