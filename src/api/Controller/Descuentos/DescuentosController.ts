import Get from "../../Methodget";
import Post from "../../MethodPost";
import Put from "../../MethodPut";
import Delete from "../../MethodDelete";
import { UrlDescuentosEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";
import { IgetApiResponseProps } from "../../../helper/VariablesGLobal";
//prettier-ignore
import { IAdminDiscountDto, IAdminDiscountFormDto, IFilterDescuentosAdminDto } from "./InterfaceDescuentos";

export const UseDiscounts = (): UseDiscountsProps => {

    const Listar = async (filter: IFilterDescuentosAdminDto) => {
        let url = UrlDescuentosEndpoints.ListarTodosDescuentos;

        const params = new URLSearchParams();

        if (filter.name) {
            params.append("Name", filter.name);
        }

        if (filter.targetType != null) {
            params.append("TargetType", filter.targetType.toString());
        }

        if (filter.tipoDescuento != null) {
            params.append("TipoDescuento", filter.tipoDescuento.toString());
        }

        if (filter.soloVigentes != null) {
            params.append("SoloVigentes", filter.soloVigentes ? "true" : "false");
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
            const response = await Get<InterfaceController<IgetApiResponseProps<IAdminDiscountDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IAdminDiscountFormDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<IAdminDiscountDto>>(UrlDescuentosEndpoints.CrearDescuento, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (data: IAdminDiscountFormDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<IAdminDiscountDto>>(UrlDescuentosEndpoints.ActualizarDescuento, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlDescuentosEndpoints.EliminarDescuento, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseDiscountsProps {
    Listar: (filter: IFilterDescuentosAdminDto) => Promise<IgetApiResponseProps<IAdminDiscountDto[]>>;
    Crear: (data: IAdminDiscountFormDto) => Promise<InterfaceController<IAdminDiscountDto>>;
    Actualizar: (data: IAdminDiscountFormDto) => Promise<InterfaceController<IAdminDiscountDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
