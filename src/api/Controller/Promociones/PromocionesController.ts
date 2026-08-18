import Get from "../../Methodget";
import Post from "../../MethodPost";
import { postFileRequest } from "../../postFileRequest";
import { putFileRequest } from "../../putFileRequest";
import { UrlPromocionesEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";
import { IgetApiResponseProps } from "../../../helper/VariablesGLobal";
//prettier-ignore
import { IAdminPromotionDto, IAdminPromotionRestockDto, IFilterPromotionsAdminDto } from "./InterfacePromociones";

export const UsePromotions = (): UsePromotionsProps => {

    const Listar = async (filter: IFilterPromotionsAdminDto) => {
        let url = UrlPromocionesEndpoints.ListarPromociones;

        const params = new URLSearchParams();

        if (filter.name) {
            params.append("Name", filter.name);
        }

        if (filter.status) {
            params.append("Status", filter.status);
        }

        if (filter.stockMin != null) {
            params.append("StockMin", filter.stockMin.toString());
        }

        if (filter.stockMax != null) {
            params.append("StockMax", filter.stockMax.toString());
        }

        if (filter.priceMin != null) {
            params.append("PriceMin", filter.priceMin.toString());
        }

        if (filter.priceMax != null) {
            params.append("PriceMax", filter.priceMax.toString());
        }

        if (filter.startDateFrom) {
            params.append("StartDateFrom", filter.startDateFrom);
        }

        if (filter.startDateTo) {
            params.append("StartDateTo", filter.startDateTo);
        }

        if (filter.endDateFrom) {
            params.append("EndDateFrom", filter.endDateFrom);
        }

        if (filter.endDateTo) {
            params.append("EndDateTo", filter.endDateTo);
        }

        if (filter.take !== 0) {
            params.append("Skip", filter.skip.toString());
            params.append("Take", filter.take.toString());
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            //prettier-ignore
            const response = await Get<InterfaceController<IgetApiResponseProps<IAdminPromotionDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: FormData) => {
        try {
            //prettier-ignore
            const response = await postFileRequest<InterfaceController<IAdminPromotionDto>>(UrlPromocionesEndpoints.CrearPromocion, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (data: FormData) => {
        try {
            //prettier-ignore
            const response = await putFileRequest<InterfaceController<IAdminPromotionDto>>(UrlPromocionesEndpoints.ActualizarPromocion, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Reponer = async (id: number, data: IAdminPromotionRestockDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<IAdminPromotionDto>>(UrlPromocionesEndpoints.ReponerPromocion + id, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Reponer };
};

export interface UsePromotionsProps {
    Listar: (filter: IFilterPromotionsAdminDto) => Promise<IgetApiResponseProps<IAdminPromotionDto[]>>;
    Crear: (data: FormData) => Promise<InterfaceController<IAdminPromotionDto>>;
    Actualizar: (data: FormData) => Promise<InterfaceController<IAdminPromotionDto>>;
    Reponer: (id: number, data: IAdminPromotionRestockDto) => Promise<InterfaceController<IAdminPromotionDto>>;
}
