import type { ProductSummary } from '../types/orders';

export const IVA_RATE = 0.15;

export function calculateOrderSubtotal(products: ProductSummary[]) {
  return products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0);
}

export function calculateOrderTotals(products: ProductSummary[]) {
  const subtotal = calculateOrderSubtotal(products);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  return { iva, subtotal, total };
}
