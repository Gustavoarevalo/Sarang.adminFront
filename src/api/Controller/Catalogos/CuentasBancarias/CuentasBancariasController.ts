import Get from "../../../Methodget";
import Post from "../../../MethodPost";
import Put from "../../../MethodPut";
import Delete from "../../../MethodDelete";
import { UrlCuentasBancariasEndpoints } from "../../../url";
import { InterfaceController } from "../../../InterfaceController";
import { IgetApiResponseProps } from "../../../../helper/VariablesGLobal";
//prettier-ignore
import { ICuentaBancariaDto, IFilterCuentaBancariaAdminDto, IUpsertCuentaBancariaDto } from "./InterfaceCuentasBancarias";

export const UseCuentasBancarias = (): UseCuentasBancariasProps => {

    const Listar = async (filter: IFilterCuentaBancariaAdminDto) => {
        let url = UrlCuentasBancariasEndpoints.ListarCuentasBancarias;

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
            const response = await Get<InterfaceController<IgetApiResponseProps<ICuentaBancariaDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertCuentaBancariaDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<ICuentaBancariaDto>>(UrlCuentasBancariasEndpoints.CrearCuentaBancaria, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertCuentaBancariaDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<ICuentaBancariaDto>>(`${UrlCuentasBancariasEndpoints.ActualizarCuentaBancaria}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlCuentasBancariasEndpoints.EliminarCuentaBancaria, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseCuentasBancariasProps {
    //prettier-ignore
    Listar: (filter: IFilterCuentaBancariaAdminDto) => Promise<IgetApiResponseProps<ICuentaBancariaDto[]>>;
    Crear: (data: IUpsertCuentaBancariaDto) => Promise<InterfaceController<ICuentaBancariaDto>>;
    //prettier-ignore
    Actualizar: (id: number, data: IUpsertCuentaBancariaDto) => Promise<InterfaceController<ICuentaBancariaDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
