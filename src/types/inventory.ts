export type ProductCategory = 'Skin care' | 'Cosmeticos' | 'Suplementos';

export type ProductMediaType = 'image' | 'video';

export type ProductMedia = {
  id: string;
  type: ProductMediaType;
  uri: string;
  altText: string;
  title: string;
  description: string;
  isCover: boolean;
};

export type InventoryProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  ingredientes?: string;
  descripcion?: string;
  modoDeUso?: string;
  stock: number;
  basePrice: number;
  price: number;
  backendUnitCost: number;
  incomingStockSuggestion: number;
  media: ProductMedia[];
};

export type ProductBatchFee = {
  id: string;
  label: string;
  type: 'fixed' | 'percent';
  amount: number;
  calculatedAmount: number;
};

export type ProductBatch = {
  id: string;
  batchCode: string;
  batchCost: number;
  fees: ProductBatchFee[];
  importerCommissionPercent: number;
  importerCommissionAmount: number;
  arrivalDate: string;
  publishDate: string;
  items: ProductBatchItem[];
};

export type ProductBatchItem = {
  id: string;
  productId: string;
  productName: string;
  expectedQuantity: number;
  receivedExcellentQuantity: number;
  receivedDamagedQuantity: number;
  quantity: number;
  baseUnitCost: number;
  unitCost: number;
  realUnitCost: number;
  profitAmount: number;
  markupOnCostPercent: number;
  grossMarginPercent: number;
  suggestedPvp: number;
  ivaPercent: number;
  ivaAmount: number;
  finalPriceWithIva: number;
  totalCost: number;
  totalRevenueWithoutIva: number;
  totalIva: number;
  totalRevenueWithIva: number;
  totalProfit: number;
  finalPvp: number;
};
