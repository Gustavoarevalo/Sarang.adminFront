import { IDropBoxGlobal } from "../../../helper/VariablesGLobal";
import Get from "../../Methodget";
import { UrlDropDownsEndpoints } from "../../url";

//prettier-ignore
export const UseDropDowns = (): UseDropDownsProps => {

    const Adapter = (response: IDropBoxGlobal[]): IDropBoxGlobal[] =>
        response.map((e) => ({ value: e.value || 0, label: e.label || '' }));

    const getTipoProducto = async () => {
        try {
            const response = await Get<IDropBoxGlobal[]>(UrlDropDownsEndpoints.EnumTipoProducto);
            return Promise.resolve(Adapter(response));
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getCategoriaProducto = async () => {
        try {
            const response = await Get<IDropBoxGlobal[]>(UrlDropDownsEndpoints.CategoriaProducto);
            return Promise.resolve(Adapter(response));
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getTipoImpuesto = async () => {
        try {
            const response = await Get<IDropBoxGlobal[]>(UrlDropDownsEndpoints.EnumTipoImpuesto);
            return Promise.resolve(Adapter(response));
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getEstadoRecepcion = async () => {
        try {
            const response = await Get<IDropBoxGlobal[]>(UrlDropDownsEndpoints.EnumEstadoRecepcion);
            return Promise.resolve(Adapter(response));
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { getTipoProducto, getCategoriaProducto, getTipoImpuesto, getEstadoRecepcion };
};

export interface UseDropDownsProps {
    getTipoProducto: () => Promise<IDropBoxGlobal[]>;
    getCategoriaProducto: () => Promise<IDropBoxGlobal[]>;
    getTipoImpuesto: () => Promise<IDropBoxGlobal[]>;
    getEstadoRecepcion: () => Promise<IDropBoxGlobal[]>;
}
