import { IFilterGlobal } from "../../../helper/VariablesGLobal";

export interface IFilterLotesAdminDto extends IFilterGlobal {
    codigo: string | null;
    fechaDesde: string | null;
    fechaHasta: string | null;
    valorMin: number | null;
    valorMax: number | null;
}

export const DataDefaultFilterLotesAdminDto: IFilterLotesAdminDto = {
    codigo: null,
    fechaDesde: null,
    fechaHasta: null,
    valorMin: null,
    valorMax: null,
    skip: 0,
    take: 20,
};

export interface IAdminLoteProductoDto {
    idLoteProducto: number;
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    cantidadBuenos: number;
    cantidadDanados: number;
    precioCompraUnitario: number;
    precioVentaUnitario: number;
    margenVentaPorcentaje: number;
}

export interface IAdminLoteImpuestoDto {
    idLoteImpuesto: number;
    idImpuesto: number | null;
    nombre: string;
    esIva: boolean;
    esPorcentaje: boolean;
    valor: number;
    montoCalculado: number;
    orden: number;
}

export interface IAdminLoteDto {
    id: number;
    codigoLote: string;
    descripcion: string;
    valorLote: number;
    costoEnvio: number;
    fechaLlegada: string | null;
    fechaSalidaVenta: string | null;
    idIvaEntitys: number;
    ivaPorcentaje: number;
    totalProductos: number;
    totalUnidades: number;
    costoTotal: number;
    productos: IAdminLoteProductoDto[];
    impuestos: IAdminLoteImpuestoDto[];
}

export interface IUpsertLoteProductoDto {
    idLoteProducto: number;
    idProducto: number;
    cantidadBuenos: number;
    cantidadDanados: number;
    precioCompraUnitario: number;
    precioVentaUnitario: number;
    margenVentaPorcentaje: number;
}

export interface IUpsertLoteImpuestoDto {
    idImpuesto: number | null;
    nombre: string;
    esIva: boolean;
    esPorcentaje: boolean;
    valor: number;
    montoCalculado: number;
    orden: number;
}

export interface IUpsertLoteDto {
    codigoLote: string;
    descripcion: string;
    valorLote: number;
    costoEnvio: number;
    fechaLlegada: string | null;
    fechaSalidaVenta: string | null;
    idIvaEntitys: number;
    productos: IUpsertLoteProductoDto[];
    impuestos: IUpsertLoteImpuestoDto[];
}

export const DataDefaultUpsertLote: IUpsertLoteDto = {
    codigoLote: '',
    descripcion: '',
    valorLote: 0,
    costoEnvio: 0,
    fechaLlegada: null,
    fechaSalidaVenta: null,
    idIvaEntitys: 0,
    productos: [],
    impuestos: [],
};
