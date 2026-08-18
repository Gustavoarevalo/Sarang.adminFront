import { IFilterGlobal } from "../../../../helper/VariablesGLobal";

export type IFilterIvaAdminDto = IFilterGlobal;

export const DataDefaultFilterIvaAdminDto: IFilterIvaAdminDto = {
    skip: 0,
    take: 50,
};

export interface IIvaDto {
    id: number;
    porcentaje: number;
    esPredeterminado: boolean;
}

export interface IUpsertIvaDto {
    porcentaje: number;
    esPredeterminado: boolean;
}

export const DataDefaultUpsertIva: IUpsertIvaDto = {
    porcentaje: 0,
    esPredeterminado: false,
};

export interface IdataDefaultIva {
    data: IIvaDto[];
    countPage: number;
    filter: IFilterIvaAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    typeOperacion: "Agregar" | "Editar";
    validate: boolean;
    modal: boolean;
    idSeleccionado: number;
    operacion: IUpsertIvaDto;
}

export const dataDefaultIva: IdataDefaultIva = {
    data: [],
    countPage: 0,
    filter: DataDefaultFilterIvaAdminDto,
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    typeOperacion: "Agregar",
    validate: false,
    modal: false,
    idSeleccionado: 0,
    operacion: DataDefaultUpsertIva,
};
