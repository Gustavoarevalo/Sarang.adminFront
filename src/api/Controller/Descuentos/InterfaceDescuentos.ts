import { IFilterGlobal } from "../../../helper/VariablesGLobal";

// Valores que coinciden con los enums del back:
// EnumTargetDescuento { Producto = 1, Promocion = 2 }
// EnumTipoDescuento   { Porcentaje = 1, Fijo = 2 }
export const DISCOUNT_TARGET = { Producto: 1, Promocion: 2 } as const;
export const DISCOUNT_TYPE = { Porcentaje: 1, Fijo: 2 } as const;

export interface IFilterDescuentosAdminDto extends IFilterGlobal {
    name: string | null;
    targetType: number | null;
    tipoDescuento: number | null;
    soloVigentes: boolean | null;
}

export const DataDefaultFilterDescuentosAdminDto: IFilterDescuentosAdminDto = {
    name: null,
    targetType: null,
    tipoDescuento: null,
    soloVigentes: null,
    skip: 0,
    take: 20,
};

// DTO de salida que devuelve el back al listar descuentos.
export interface IAdminDiscountDto {
    id: number;
    name: string;
    targetType: number;
    targetTypeNombre: string;
    targetId: number;
    targetName: string;
    tipoDescuento: number;
    tipoDescuentoNombre: string;
    valorDescuento: number;
    startDate: string;
    endDate: string;
    baseCost: number;
    originalPvpWithoutIva: number;
    originalFinalWithIva: number;
    discountedPvpWithoutIva: number;
    discountedFinalWithIva: number;
}

// DTO que se envia al back para crear/actualizar. El back calcula los snapshots.
export interface IAdminDiscountFormDto {
    idDescuento: number;
    name: string | null;
    targetType: number;
    targetId: number;
    tipoDescuento: number;
    valorDescuento: number;
    startDate: string;
    endDate: string;
}

export const DataDefaultDiscountFormDto: IAdminDiscountFormDto = {
    idDescuento: 0,
    name: null,
    targetType: DISCOUNT_TARGET.Producto,
    targetId: 0,
    tipoDescuento: DISCOUNT_TYPE.Porcentaje,
    valorDescuento: 0,
    startDate: '',
    endDate: '',
};
