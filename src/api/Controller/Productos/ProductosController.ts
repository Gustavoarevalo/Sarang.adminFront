import Get from "../../Methodget";
import Delete from "../../MethodDelete";
import { postFileRequest } from "../../postFileRequest";
import { putFileRequest } from "../../putFileRequest";
import { UrlProductsEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";
import { IgetApiResponseProps } from "../../../helper/VariablesGLobal";
import { IAdminInventoryProductDto, IFilterProductsAdminDto } from "./InterfaceProducts";

export const UseProducts = (): UseProductsProps => {

    const Listar = async (filter: IFilterProductsAdminDto) => {
        let url = UrlProductsEndpoints.ListarTodosProductos;

        const params = new URLSearchParams();

        if (filter.name) {
            params.append("Name", filter.name);
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

        if (filter.tipoProducto) {
            params.append("TipoProducto", filter.tipoProducto);
        }

        if (filter.idCategoria != null) {
            params.append("idCategoria", filter.idCategoria.toString());
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
            const response = await Get<InterfaceController<IgetApiResponseProps<IAdminInventoryProductDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: FormData) => {
        try {
            //prettier-ignore
            const response = await postFileRequest<InterfaceController<IAdminInventoryProductDto>>(UrlProductsEndpoints.CrearProducto, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (data: FormData) => {
        try {
            //prettier-ignore
            const response = await putFileRequest<InterfaceController<IAdminInventoryProductDto>>(UrlProductsEndpoints.ActualizarProducto, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlProductsEndpoints.EliminarProducto, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseProductsProps {
    Listar: (filter: IFilterProductsAdminDto) => Promise<IgetApiResponseProps<IAdminInventoryProductDto[]>>;
    Crear: (data: FormData) => Promise<InterfaceController<IAdminInventoryProductDto>>;
    Actualizar: (data: FormData) => Promise<InterfaceController<IAdminInventoryProductDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
