import { IFilterGlobal } from "../../../helper/VariablesGLobal";

export interface IFilterProductsAdminDto extends IFilterGlobal {
    name: string | null;
    stockMin: number | null;
    tipoProducto: string | null;
    idCategoria: number | null;
    stockMax: number | null;
    priceMin: number | null;
    priceMax: number | null;
}

export const DataDefaultFilterProductsAdminDto: IFilterProductsAdminDto = {
    name: null,
    stockMin: null,
    stockMax: null,
    priceMin: null,
    priceMax: null,
    tipoProducto: null,
    skip: 0,
    take: 20,
    idCategoria: null,
};

export interface IAdminProductMediaDto {
    id: number;
    idArchivoStorageEntitys: number;
    type: string;
    uri: string;
    altText: string;
    title: string;
    description: string;
    isCover: boolean;
}

export interface IAdminProductCategoriaDto {
    idCategoria: number;
    nombre: string;
}

export interface IAdminInventoryProductDto {
    id: number;
    name: string;
    category: string;
    ingredientes: string | null;
    descripcion: string | null;
    modoDeUso: string | null;
    stock: number;
    basePrice: number;
    price: number;
    backendUnitCost: number;
    margenVentaPorcentaje: number;
    ancho: number;
    alto: number;
    profundidad: number;
    incomingStockSuggestion: number;
    media: IAdminProductMediaDto[];
    categorias: IAdminProductCategoriaDto[];
}

export interface ICreateProductAdminDto {
    name: string;
    ingredientes: string | null;
    descripcion: string | null;
    modoDeUso: string | null;
    stock: number;
    basePrice: number;
    price: number;
    backendUnitCost: number;
    categorias: IAdminProductCategoriaDto[];
    media: IAdminProductMediaDto[];
}

export const DataDefaultCreateProductAdminDto: ICreateProductAdminDto = {
    name: '',
    ingredientes: null,
    descripcion: null,
    modoDeUso: null,
    stock: 0,
    basePrice: 0,
    price: 0,
    backendUnitCost: 0,
    categorias: [],
    media: [],
};
