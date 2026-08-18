import { IFilterGlobal } from "../../../../helper/VariablesGLobal";

export interface IFilterCategoriasAdminDto extends IFilterGlobal {
    nombre: string | null;
    tipoProducto: string | null;
}

export const DataDefaultFilterCategoriasAdminDto: IFilterCategoriasAdminDto = {
    nombre: null,
    tipoProducto: null,
    skip: 0,
    take: 20,
};

export interface ICategoriaProductoDto {
    id: number;
    nombre: string;
    descripcion: string;
    idArchivoStorageEntitys: number | null;
    iconoUrl: string;
    enumTipoProducto: number;
    tipoProducto: string;
    productosAsociados: number;
}

export interface IUpsertCategoriaDto {
    nombre: string;
    descripcion: string;
    idArchivoStorageEntitys: number | null;
    enumTipoProducto: number;
}

export const DataDefaultUpsertCategoria: IUpsertCategoriaDto = {
    nombre: '',
    descripcion: '',
    idArchivoStorageEntitys: null,
    enumTipoProducto: 0,
};

export interface IdataDefaultCategorias {
    data: ICategoriaProductoDto[];
    countPage: number;
    filter: IFilterCategoriasAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    typeOperacion: "Agregar" | "Editar";
    validate: boolean;
    modal: boolean;
    modalFilter: boolean;
    idSeleccionado: number;
    iconoUrl: string;
    operacion: IUpsertCategoriaDto;
    tipoProductoDropDown: { value: number; label: string }[];
}

export const dataDefaultCategorias: IdataDefaultCategorias = {
    data: [],
    countPage: 0,
    filter: DataDefaultFilterCategoriasAdminDto,
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    typeOperacion: "Agregar",
    validate: false,
    modal: false,
    modalFilter: false,
    idSeleccionado: 0,
    iconoUrl: '',
    operacion: DataDefaultUpsertCategoria,
    tipoProductoDropDown: [],
};
