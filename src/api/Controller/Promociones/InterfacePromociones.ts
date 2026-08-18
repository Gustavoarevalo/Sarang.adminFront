import { IFilterGlobal } from "../../../helper/VariablesGLobal";

export interface IAdminPromotionItemDto {
    productId: number;
    quantity: number;
}

export interface IAdminPromotionMediaDto {
    id: number;
    idArchivoStorageEntitys: number;
    type: string;
    uri: string;
    altText: string;
    title: string;
    description: string;
    isCover: boolean;
}

export interface IAdminPromotionDto {
    id: number;
    name: string;
    status?: 'active' | 'finished' | 'pending';
    endDate: string | null;
    startDate: string;
    items: IAdminPromotionItemDto[];
    stock: number;
    baseCost: number;
    pvpWithoutIva: number;
    ivaAmount: number;
    finalPriceWithIva: number;
    profitAmount: number;
    grossMarginPercent: number;
    media: IAdminPromotionMediaDto[];
}

export interface IAdminPromotionRestockDto {
    quantity: number;
}

export interface IFilterPromotionsAdminDto extends IFilterGlobal {
    name: string | null;
    status: 'active' | 'finished' | 'pending' | null;
    stockMin: number | null;
    stockMax: number | null;
    priceMin: number | null;
    priceMax: number | null;
    startDateFrom: string | null;
    startDateTo: string | null;
    endDateFrom: string | null;
    endDateTo: string | null;
}

export const DataDefaultFilterPromotionsAdminDto: IFilterPromotionsAdminDto = {
    name: null,
    status: null,
    stockMin: null,
    stockMax: null,
    priceMin: null,
    priceMax: null,
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null,
    skip: 0,
    take: 20,
};

// Formulario de promocion usado por la pantalla (se serializa a FormData al guardar).
export interface IPromotionFormItem {
    productId: number;
    name: string;
    quantity: number;
    unitCost: number;
    unitPvpWithoutIva: number;
}

export interface IPromotionFormDto {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    stock: number;
    finalPriceWithIva: number;
    ivaPercent: number;
    items: IPromotionFormItem[];
}

export const DataDefaultPromotionForm: IPromotionFormDto = {
    id: 0,
    name: '',
    startDate: '',
    endDate: '',
    stock: 0,
    finalPriceWithIva: 0,
    ivaPercent: 0,
    items: [],
};
