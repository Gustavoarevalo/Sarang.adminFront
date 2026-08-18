import Get from "../../../Methodget";
import Post from "../../../MethodPost";
import Put from "../../../MethodPut";
import Delete from "../../../MethodDelete";
import { UrlImpuestosEndpoints } from "../../../url";
import { InterfaceController } from "../../../InterfaceController";
import { IgetApiResponseProps } from "../../../../helper/VariablesGLobal";
import {
    IImpuestoDto,
    IFilterImpuestosAdminDto,
    IUpsertImpuestoDto,
} from "./InterfaceImpuestos";

export const UseImpuestos = (): UseImpuestosProps => {

    const Listar = async (filter: IFilterImpuestosAdminDto) => {
        let url = UrlImpuestosEndpoints.ListarImpuestos;

        const params = new URLSearchParams();

        if (filter.nombre) {
            params.append("Nombre", filter.nombre);
        }

        if (filter.tipoImpuesto) {
            params.append("TipoImpuesto", filter.tipoImpuesto);
        }

        if (filter.take != 0) {
            params.append("Skip", filter.skip.toString());
            params.append("Take", filter.take.toString());
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            //prettier-ignore
            const response = await Get<InterfaceController<IgetApiResponseProps<IImpuestoDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertImpuestoDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<IImpuestoDto>>(UrlImpuestosEndpoints.CrearImpuesto, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertImpuestoDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<IImpuestoDto>>(`${UrlImpuestosEndpoints.ActualizarImpuesto}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlImpuestosEndpoints.EliminarImpuesto, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseImpuestosProps {
    Listar: (filter: IFilterImpuestosAdminDto) => Promise<IgetApiResponseProps<IImpuestoDto[]>>;
    Crear: (data: IUpsertImpuestoDto) => Promise<InterfaceController<IImpuestoDto>>;
    Actualizar: (id: number, data: IUpsertImpuestoDto) => Promise<InterfaceController<IImpuestoDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
