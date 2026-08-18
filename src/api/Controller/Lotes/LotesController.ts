import Get from "../../Methodget";
import Post from "../../MethodPost";
import Put from "../../MethodPut";
import { UrlLotesEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";
import { IgetApiResponseProps } from "../../../helper/VariablesGLobal";
import { IAdminLoteDto, IFilterLotesAdminDto, IUpsertLoteDto } from "./InterfaceLotes";

export const UseLotes = (): UseLotesProps => {

    const Listar = async (filter: IFilterLotesAdminDto) => {
        let url = UrlLotesEndpoints.ListarTodosLotes;

        const params = new URLSearchParams();

        if (filter.codigo) {
            params.append("Codigo", filter.codigo);
        }

        if (filter.fechaDesde) {
            params.append("FechaDesde", filter.fechaDesde);
        }

        if (filter.fechaHasta) {
            params.append("FechaHasta", filter.fechaHasta);
        }

        if (filter.valorMin != null) {
            params.append("ValorMin", filter.valorMin.toString());
        }

        if (filter.valorMax != null) {
            params.append("ValorMax", filter.valorMax.toString());
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
            const response = await Get<InterfaceController<IgetApiResponseProps<IAdminLoteDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertLoteDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<IAdminLoteDto>>(UrlLotesEndpoints.CrearLote, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertLoteDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<IAdminLoteDto>>(`${UrlLotesEndpoints.ActualizarLote}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar };
};

export interface UseLotesProps {
    Listar: (filter: IFilterLotesAdminDto) => Promise<IgetApiResponseProps<IAdminLoteDto[]>>;
    Crear: (data: IUpsertLoteDto) => Promise<InterfaceController<IAdminLoteDto>>;
    Actualizar: (id: number, data: IUpsertLoteDto) => Promise<InterfaceController<IAdminLoteDto>>;
}
