import { IAdminInventoryProductDto } from "../../api/Controller/Productos/InterfaceProducts";
import { IAdminPromotionDto } from "../../api/Controller/Promociones/InterfacePromociones";

export const SALES_IVA_PERCENT = 15;

export type PromotionItem = {
    productId: number;
    quantity: number;
};

export type QuantityDrafts = Record<number, string>;

export const toNumber = (value: string): number => Number(String(value).replace(',', '.')) || 0;

export const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

//prettier-ignore
export const calculatePromotion = (items: PromotionItem[], products: IAdminInventoryProductDto[], finalPriceWithIva: number) => {
    const baseCost = items.reduce((sum, item) => {
        const product = products.find((currentProduct) => currentProduct.id === item.productId);
        return sum + (product?.backendUnitCost ?? 0) * item.quantity;
    }, 0);
    const pvpWithoutIva = finalPriceWithIva > 0 ? finalPriceWithIva / (1 + SALES_IVA_PERCENT / 100) : 0;
    const ivaAmount = finalPriceWithIva > 0 ? finalPriceWithIva - pvpWithoutIva : 0;
    const profitAmount = pvpWithoutIva - baseCost;
    const grossMarginPercent = pvpWithoutIva > 0 ? (profitAmount / pvpWithoutIva) * 100 : 0;

    return { baseCost, finalPriceWithIva, grossMarginPercent, ivaAmount, profitAmount, pvpWithoutIva };
};

//prettier-ignore
export const calculatePromotionFromGrossMargin = (items: PromotionItem[], products: IAdminInventoryProductDto[], grossMarginPercent: number) => {
    const baseCost = items.reduce((sum, item) => {
        const product = products.find((currentProduct) => currentProduct.id === item.productId);
        return sum + (product?.backendUnitCost ?? 0) * item.quantity;
    }, 0);
    const safeGrossMarginPercent = Math.min(94.9, Math.max(-95, grossMarginPercent));
    const pvpWithoutIva = baseCost > 0 ? baseCost / (1 - safeGrossMarginPercent / 100) : 0;
    const ivaAmount = pvpWithoutIva * (SALES_IVA_PERCENT / 100);
    const finalPriceWithIva = pvpWithoutIva + ivaAmount;
    const profitAmount = pvpWithoutIva - baseCost;

    return {
        baseCost,
        finalPriceWithIva,
        grossMarginPercent: safeGrossMarginPercent,
        ivaAmount,
        profitAmount,
        pvpWithoutIva,
    };
};

//prettier-ignore
export const calculatePromotionAvailableStock = (items: PromotionItem[], products: IAdminInventoryProductDto[]) => {
    if (items.length === 0) {
        return 0;
    }

    return Math.min(
        ...items.map((item) => {
            const product = products.find((currentProduct) => currentProduct.id === item.productId);
            return Math.floor((product?.stock ?? 0) / item.quantity);
        }),
    );
};

//prettier-ignore
export const buildPromotionName = (items: PromotionItem[], products: IAdminInventoryProductDto[]) =>
    items
        .map((item) => {
            const product = products.find((currentProduct) => currentProduct.id === item.productId);
            return `${item.quantity}x ${product?.name ?? 'Producto'}`;
        })
        .join(' + ');

//prettier-ignore
export const buildQuantityDrafts = (products: IAdminInventoryProductDto[], promotion?: IAdminPromotionDto | null): QuantityDrafts =>
    products.reduce<QuantityDrafts>(
        (result, product) => ({
            ...result,
            [product.id]: String(
                promotion?.items.find((item) => Number(item.productId) === product.id)?.quantity ?? 0,
            ),
        }),
        {},
    );

// Al editar una promocion pendiente, las unidades ya reservadas por esa misma
// promocion vuelven a estar disponibles para recalcular el stock maximo.
//prettier-ignore
export const buildEditableProducts = (products: IAdminInventoryProductDto[], editingPromotion: IAdminPromotionDto | null) => {
    if (!editingPromotion) {
        return products;
    }

    const reservedByProduct = editingPromotion.items.reduce<Record<number, number>>((result, item) => {
        const key = Number(item.productId);
        result[key] = (result[key] ?? 0) + item.quantity * editingPromotion.stock;
        return result;
    }, {});

    return products.map((product) => ({
        ...product,
        stock: product.stock + (reservedByProduct[product.id] ?? 0),
    }));
};

const pad = (value: number) => String(value).padStart(2, '0');

//prettier-ignore
export const toDateInputValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const getToday = () => toDateInputValue(new Date());

export const addDaysToDateString = (date: string, amount: number) => {
    const [year, monthNumber, day] = date.split('-').map(Number);
    return toDateInputValue(new Date(year, monthNumber - 1, day + amount));
};

export const getTomorrow = () => addDaysToDateString(getToday(), 1);

export const getPromotionStatusLabel = (status: IAdminPromotionDto['status']) => {
    if (status === 'pending') {
        return 'Pendiente';
    }

    if (status === 'finished') {
        return 'Finalizada';
    }

    return 'Activa';
};
