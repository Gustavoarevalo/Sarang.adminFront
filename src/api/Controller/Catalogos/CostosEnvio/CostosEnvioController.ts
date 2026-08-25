import Get from "../../../Methodget";
import Post from "../../../MethodPost";
import Put from "../../../MethodPut";
import Delete from "../../../MethodDelete";
import { UrlCostosEnvioEndpoints } from "../../../url";
import { InterfaceController } from "../../../InterfaceController";
import { IgetApiResponseProps } from "../../../../helper/VariablesGLobal";
//prettier-ignore
import { ICostoEnvioProvinciaDto, IFilterCostoEnvioAdminDto, IUpsertCostoEnvioProvinciaDto } from "./InterfaceCostosEnvio";

export const UseCostosEnvio = (): UseCostosEnvioProps => {

    const Listar = async (filter: IFilterCostoEnvioAdminDto) => {
        let url = UrlCostosEnvioEndpoints.ListarCostosEnvio;

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
            const response = await Get<InterfaceController<IgetApiResponseProps<ICostoEnvioProvinciaDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    // Provincias que el back acepta. El costo se registra contra este nombre exacto,
    // asi el cruce con la direccion del cliente no falla por como se escribio.
    const ListarProvincias = async () => {
        try {
            //prettier-ignore
            const response = await Get<InterfaceController<string[]>>(UrlCostosEnvioEndpoints.ListarProvincias);
            return Promise.resolve(response.detail ?? []);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertCostoEnvioProvinciaDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<ICostoEnvioProvinciaDto>>(UrlCostosEnvioEndpoints.CrearCostoEnvio, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertCostoEnvioProvinciaDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<ICostoEnvioProvinciaDto>>(`${UrlCostosEnvioEndpoints.ActualizarCostoEnvio}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlCostosEnvioEndpoints.EliminarCostoEnvio, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, ListarProvincias, Crear, Actualizar, Eliminar };
};

export interface UseCostosEnvioProps {
    Listar: (filter: IFilterCostoEnvioAdminDto) => Promise<IgetApiResponseProps<ICostoEnvioProvinciaDto[]>>;
    ListarProvincias: () => Promise<string[]>;
    Crear: (data: IUpsertCostoEnvioProvinciaDto) => Promise<InterfaceController<ICostoEnvioProvinciaDto>>;
    Actualizar: (id: number, data: IUpsertCostoEnvioProvinciaDto) => Promise<InterfaceController<ICostoEnvioProvinciaDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
