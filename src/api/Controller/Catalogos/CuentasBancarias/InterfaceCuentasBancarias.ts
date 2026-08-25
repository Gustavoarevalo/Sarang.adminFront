import { IFilterGlobal } from "../../../../helper/VariablesGLobal";

export type IFilterCuentaBancariaAdminDto = IFilterGlobal;

export const DataDefaultFilterCuentaBancariaAdminDto: IFilterCuentaBancariaAdminDto = {
    skip: 0,
    take: 50,
};

/** Espejo de EnumTipoCuentaBancaria del backend. */
export enum EnumTipoCuentaBancaria {
    Ahorros = 1,
    Corriente = 2,
}

export const tipoCuentaLabels: Record<EnumTipoCuentaBancaria, string> = {
    [EnumTipoCuentaBancaria.Ahorros]: "Ahorros",
    [EnumTipoCuentaBancaria.Corriente]: "Corriente",
};

export interface ICuentaBancariaDto {
    id: number;
    nombreBanco: string;
    tipoCuenta: EnumTipoCuentaBancaria;
    tipoCuentaNombre: string;
    numeroCuenta: string;
    ruc: string;
    titularNombre: string;
    emailContacto?: string | null;
    observacion?: string | null;
    /** Orden en el checkout: la primera cuenta es la que abre desplegada. */
    orden: number;
}

export interface IUpsertCuentaBancariaDto {
    nombreBanco: string;
    tipoCuenta: EnumTipoCuentaBancaria;
    numeroCuenta: string;
    ruc: string;
    titularNombre: string;
    emailContacto: string;
    observacion: string;
    orden: number;
}

export const DataDefaultUpsertCuentaBancaria: IUpsertCuentaBancariaDto = {
    nombreBanco: "",
    tipoCuenta: EnumTipoCuentaBancaria.Ahorros,
    numeroCuenta: "",
    ruc: "",
    titularNombre: "",
    emailContacto: "",
    observacion: "",
    orden: 0,
};

export interface IdataDefaultCuentaBancaria {
    data: ICuentaBancariaDto[];
    countPage: number;
    filter: IFilterCuentaBancariaAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    typeOperacion: "Agregar" | "Editar";
    validate: boolean;
    modal: boolean;
    idSeleccionado: number;
    operacion: IUpsertCuentaBancariaDto;
}

export const dataDefaultCuentaBancaria: IdataDefaultCuentaBancaria = {
    data: [],
    countPage: 0,
    filter: DataDefaultFilterCuentaBancariaAdminDto,
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    typeOperacion: "Agregar",
    validate: false,
    modal: false,
    idSeleccionado: 0,
    operacion: DataDefaultUpsertCuentaBancaria,
};
