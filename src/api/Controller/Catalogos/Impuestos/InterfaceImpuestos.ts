import { IFilterGlobal } from "../../../../helper/VariablesGLobal";

export interface IFilterImpuestosAdminDto extends IFilterGlobal {
    nombre: string | null;
    tipoImpuesto: string | null;
}

export const DataDefaultFilterImpuestosAdminDto: IFilterImpuestosAdminDto = {
    nombre: null,
    tipoImpuesto: null,
    skip: 0,
    take: 20,
};

export interface IImpuestoDto {
    id: number;
    nombre: string;
    descripcion: string;
    enumTipoImpuesto: number;
    tipoImpuesto: string;
    valor: number;
}

export interface IUpsertImpuestoDto {
    nombre: string;
    descripcion: string;
    enumTipoImpuesto: number;
    valor: number;
}

export const DataDefaultUpsertImpuesto: IUpsertImpuestoDto = {
    nombre: '',
    descripcion: '',
    enumTipoImpuesto: 0,
    valor: 0,
};

export interface IdataDefaultImpuestos {
    data: IImpuestoDto[];
    countPage: number;
    filter: IFilterImpuestosAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    typeOperacion: "Agregar" | "Editar";
    validate: boolean;
    modal: boolean;
    modalFilter: boolean;
    idSeleccionado: number;
    operacion: IUpsertImpuestoDto;
    tipoImpuestoDropDown: { value: number; label: string }[];
}

export const dataDefaultImpuestos: IdataDefaultImpuestos = {
    data: [],
    countPage: 0,
    filter: DataDefaultFilterImpuestosAdminDto,
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    typeOperacion: "Agregar",
    validate: false,
    modal: false,
    modalFilter: false,
    idSeleccionado: 0,
    operacion: DataDefaultUpsertImpuesto,
    tipoImpuestoDropDown: [],
};
