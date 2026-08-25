import { IFilterGlobal } from "../../../../helper/VariablesGLobal";

export type IFilterCostoEnvioAdminDto = IFilterGlobal;

export const DataDefaultFilterCostoEnvioAdminDto: IFilterCostoEnvioAdminDto = {
    skip: 0,
    take: 50,
};

export interface ICostoEnvioProvinciaDto {
    id: number;
    provincia: string;
    costo: number;
}

export interface IUpsertCostoEnvioProvinciaDto {
    provincia: string;
    costo: number;
}

export const DataDefaultUpsertCostoEnvio: IUpsertCostoEnvioProvinciaDto = {
    provincia: "",
    costo: 0,
};

export interface IdataDefaultCostoEnvio {
    data: ICostoEnvioProvinciaDto[];
    provincias: string[];
    countPage: number;
    filter: IFilterCostoEnvioAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    typeOperacion: "Agregar" | "Editar";
    validate: boolean;
    modal: boolean;
    idSeleccionado: number;
    operacion: IUpsertCostoEnvioProvinciaDto;
}

export const dataDefaultCostoEnvio: IdataDefaultCostoEnvio = {
    data: [],
    provincias: [],
    countPage: 0,
    filter: DataDefaultFilterCostoEnvioAdminDto,
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    typeOperacion: "Agregar",
    validate: false,
    modal: false,
    idSeleccionado: 0,
    operacion: DataDefaultUpsertCostoEnvio,
};
