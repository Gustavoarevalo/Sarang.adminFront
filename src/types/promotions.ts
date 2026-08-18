export type PromotionItem = {
  productId: string;
  quantity: number;
};

export type Promotion = {
  id: string;
  name: string;
  endDate: string | null;
  startDate: string;
  items: PromotionItem[];
  stock: number;
  baseCost: number;
  pvpWithoutIva: number;
  ivaAmount: number;
  finalPriceWithIva: number;
  profitAmount: number;
  grossMarginPercent: number;
};
