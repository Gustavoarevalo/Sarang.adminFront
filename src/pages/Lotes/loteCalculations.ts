import { IImpuestoDto } from "../../api/Controller/Catalogos/Impuestos/InterfaceImpuestos";
import { IAdminInventoryProductDto } from "../../api/Controller/Productos/InterfaceProducts";

// EnumTipoImpuesto: Porcentaje = 1, Valor (monto fijo) = 2.
export const TIPO_IMPUESTO_PORCENTAJE = 1;

export const DEFAULT_SALES_IVA_PERCENT = 15;

// Renglon del IVA del lote dentro del orden de impuestos. Usa un id estable
// para poder ubicarlo/actualizarlo sin duplicarlo.
export const IVA_FEE_ID = 'fee-iva';

// Datos minimos que el modal necesita de un producto seleccionado en el lote.
export type SelectedProduct = Pick<
    IAdminInventoryProductDto,
    'id' | 'name' | 'basePrice' | 'incomingStockSuggestion'
>;

export type BatchItemDraft = {
    customerFinalPrice: string;
    grossMarginPercent: string;
    isSelected: boolean;
    // Desglose de recepcion: solo los buenos van al inventario al publicar.
    receivedDamagedQuantity: string;
    receivedExcellentQuantity: string;
    unitCost: string;
};

export type BatchItemDrafts = Record<number, BatchItemDraft>;

export type FeeDraft = {
    id: string;
    idImpuesto: number; // 0 = tarifa manual (no viene del catalogo)
    label: string;
    type: 'fixed' | 'percent';
    amount: string;
};

export type BatchItemCalculation = {
    baseUnitCost: number;
    finalPvp: number;
    finalPriceWithIva: number;
    expectedQuantity: number;
    ivaAmount: number;
    ivaPercent: number;
    grossMarginPercent: number;
    markupOnCostPercent: number;
    profitAmount: number;
    receivedDamagedQuantity: number;
    receivedExcellentQuantity: number;
    realUnitCost: number;
    suggestedPvp: number;
    totalCost: number;
    totalIva: number;
    totalProfit: number;
    totalRevenueWithIva: number;
    totalRevenueWithoutIva: number;
    usesManualFinalPrice: boolean;
};

export const toNumber = (value: string): number => Number(String(value).replace(',', '.')) || 0;

export const buildDraftFromProduct = (product?: SelectedProduct): BatchItemDraft => ({
    customerFinalPrice: '',
    grossMarginPercent: product ? '0' : '',
    isSelected: false,
    receivedDamagedQuantity: '0',
    receivedExcellentQuantity: '0',
    unitCost: product ? String(product.basePrice) : '',
});

export const buildIvaFee = (porcentaje: number): FeeDraft => ({
    id: IVA_FEE_ID,
    idImpuesto: 0,
    label: `IVA ${porcentaje}%`,
    type: 'percent',
    amount: porcentaje ? String(porcentaje) : '',
});

// Crea un renglon de tarifa a partir de un impuesto del catalogo, precargando
// nombre, tipo (porcentaje/valor) y el valor por defecto (editable por lote).
export const buildFeeFromImpuesto = (impuesto: IImpuestoDto): FeeDraft => ({
    id: `fee-${impuesto.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    idImpuesto: impuesto.id,
    label: impuesto.nombre,
    type: impuesto.enumTipoImpuesto === TIPO_IMPUESTO_PORCENTAJE ? 'percent' : 'fixed',
    amount: impuesto.valor ? String(impuesto.valor) : '',
});

// Los impuestos se aplican en cascada segun su orden: cada uno se calcula sobre
// el acumulado de los anteriores.
export const calculateFeesInOrder = (batchCost: number, fees: FeeDraft[]) => {
    let runningTotal = batchCost;
    const breakdown: Record<string, number> = {};

    fees.forEach((fee) => {
        const rawAmount = toNumber(fee.amount);
        const calculatedAmount = fee.type === 'percent' ? runningTotal * (rawAmount / 100) : rawAmount;

        breakdown[fee.id] = calculatedAmount;
        runningTotal += calculatedAmount;
    });

    return {
        breakdown,
        total: Object.values(breakdown).reduce((sum, amount) => sum + amount, 0),
    };
};

export const calculateBatch = (input: {
    batchCost: number;
    fees: FeeDraft[];
    importerCommissionPercent: number;
    itemDrafts: BatchItemDrafts;
    products: SelectedProduct[];
    salesIvaPercent: number;
}) => {
    const feesCalculation = calculateFeesInOrder(input.batchCost, input.fees);
    const feesTotal = feesCalculation.total;
    const purchaseSubtotal = input.batchCost + feesTotal;
    const safeImporterCommissionPercent = Math.min(95, Math.max(0, input.importerCommissionPercent));
    const importerCommissionAmount = purchaseSubtotal * (safeImporterCommissionPercent / 100);
    const totalBatchCost = purchaseSubtotal + importerCommissionAmount;
    //prettier-ignore
    const selectedProducts = input.products.filter((product) => input.itemDrafts[product.id]?.isSelected);

    const items = selectedProducts.reduce<Record<number, BatchItemCalculation>>((result, product) => {
        const draft = input.itemDrafts[product.id];
        const receivedExcellentQuantity = toNumber(draft.receivedExcellentQuantity);
        const receivedDamagedQuantity = toNumber(draft.receivedDamagedQuantity);
        // El total recibido es la suma de buenos + danados.
        const expectedQuantity = receivedExcellentQuantity + receivedDamagedQuantity;
        const baseUnitCost = toNumber(draft.unitCost);
        const manualFinalPrice = toNumber(draft.customerFinalPrice);
        const usesManualFinalPrice = manualFinalPrice > 0;
        //prettier-ignore
        const safeGrossMarginPercent = Math.min(94.9, Math.max(-95, toNumber(draft.grossMarginPercent)));
        const suggestedPvp = usesManualFinalPrice
            ? manualFinalPrice / (1 + input.salesIvaPercent / 100)
            : baseUnitCost / (1 - safeGrossMarginPercent / 100);
        const ivaAmount = suggestedPvp * (input.salesIvaPercent / 100);
        const finalPriceWithIva = usesManualFinalPrice ? manualFinalPrice : suggestedPvp + ivaAmount;
        const profitAmount = suggestedPvp - baseUnitCost;
        const grossMarginPercent = suggestedPvp > 0 ? (profitAmount / suggestedPvp) * 100 : 0;
        const markupOnCostPercent = baseUnitCost > 0 ? (profitAmount / baseUnitCost) * 100 : 0;
        const totalCost = baseUnitCost * receivedExcellentQuantity;
        const totalRevenueWithoutIva = suggestedPvp * receivedExcellentQuantity;
        const totalIva = ivaAmount * receivedExcellentQuantity;
        const totalRevenueWithIva = finalPriceWithIva * receivedExcellentQuantity;
        const totalProfit = profitAmount * receivedExcellentQuantity;

        return {
            ...result,
            [product.id]: {
                baseUnitCost,
                expectedQuantity,
                finalPvp: finalPriceWithIva,
                finalPriceWithIva,
                grossMarginPercent: usesManualFinalPrice ? grossMarginPercent : safeGrossMarginPercent,
                ivaAmount,
                ivaPercent: input.salesIvaPercent,
                markupOnCostPercent,
                profitAmount,
                receivedDamagedQuantity,
                receivedExcellentQuantity,
                realUnitCost: baseUnitCost,
                suggestedPvp,
                totalCost,
                totalIva,
                totalProfit,
                totalRevenueWithIva,
                totalRevenueWithoutIva,
                usesManualFinalPrice,
            },
        };
    }, {});

    //prettier-ignore
    const estimatedRevenueWithoutIva = Object.values(items).reduce((sum, item) => sum + item.totalRevenueWithoutIva, 0);
    const batchProfitAmount = estimatedRevenueWithoutIva - totalBatchCost;
    const batchProfitPercent =
        estimatedRevenueWithoutIva > 0 ? (batchProfitAmount / estimatedRevenueWithoutIva) * 100 : 0;

    return {
        batchProfitAmount,
        batchProfitPercent,
        estimatedRevenueWithoutIva,
        feeBreakdown: feesCalculation.breakdown,
        feesTotal,
        importerCommissionAmount,
        items,
        purchaseSubtotal,
        totalBatchCost,
    };
};

export const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});
