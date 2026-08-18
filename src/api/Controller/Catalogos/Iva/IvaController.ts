import Get from "../../../Methodget";
import Post from "../../../MethodPost";
import Put from "../../../MethodPut";
import Delete from "../../../MethodDelete";
import { UrlIvaEndpoints } from "../../../url";
import { InterfaceController } from "../../../InterfaceController";
import { IgetApiResponseProps } from "../../../../helper/VariablesGLobal";
import { IIvaDto, IFilterIvaAdminDto, IUpsertIvaDto } from "./InterfaceIva";

export const UseIva = (): UseIvaProps => {

    const Listar = async (filter: IFilterIvaAdminDto) => {
        let url = UrlIvaEndpoints.ListarIvas;

        const params = new URLSearchParams();

        if (filter.take != 0) {
            params.append("Skip", filter.skip.toString());
            params.append("Take", filter.take.toString());
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            //prettier-ignore
            const response = await Get<InterfaceController<IgetApiResponseProps<IIvaDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertIvaDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<IIvaDto>>(UrlIvaEndpoints.CrearIva, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertIvaDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<IIvaDto>>(`${UrlIvaEndpoints.ActualizarIva}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlIvaEndpoints.EliminarIva, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseIvaProps {
    Listar: (filter: IFilterIvaAdminDto) => Promise<IgetApiResponseProps<IIvaDto[]>>;
    Crear: (data: IUpsertIvaDto) => Promise<InterfaceController<IIvaDto>>;
    Actualizar: (id: number, data: IUpsertIvaDto) => Promise<InterfaceController<IIvaDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
