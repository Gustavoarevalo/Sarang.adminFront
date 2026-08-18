import Get from "../../../Methodget";
import Post from "../../../MethodPost";
import Put from "../../../MethodPut";
import Delete from "../../../MethodDelete";
import { UrlCategoriasEndpoints } from "../../../url";
import { InterfaceController } from "../../../InterfaceController";
import { IgetApiResponseProps } from "../../../../helper/VariablesGLobal";
import {
    ICategoriaProductoDto,
    IFilterCategoriasAdminDto,
    IUpsertCategoriaDto,
} from "./InterfaceCategorias";

export const UseCategorias = (): UseCategoriasProps => {

    const Listar = async (filter: IFilterCategoriasAdminDto) => {
        let url = UrlCategoriasEndpoints.ListarCategorias;

        const params = new URLSearchParams();

        if (filter.nombre) {
            params.append("Nombre", filter.nombre);
        }

        if (filter.tipoProducto) {
            params.append("TipoProducto", filter.tipoProducto);
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
            const response = await Get<InterfaceController<IgetApiResponseProps<ICategoriaProductoDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Crear = async (data: IUpsertCategoriaDto) => {
        try {
            //prettier-ignore
            const response = await Post<InterfaceController<ICategoriaProductoDto>>(UrlCategoriasEndpoints.CrearCategoria, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (id: number, data: IUpsertCategoriaDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<ICategoriaProductoDto>>(`${UrlCategoriasEndpoints.ActualizarCategoria}/${id}`, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Eliminar = async (id: number) => {
        try {
            //prettier-ignore
            const response = await Delete<InterfaceController<unknown>>(UrlCategoriasEndpoints.EliminarCategoria, id);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Crear, Actualizar, Eliminar };
};

export interface UseCategoriasProps {
    Listar: (filter: IFilterCategoriasAdminDto) => Promise<IgetApiResponseProps<ICategoriaProductoDto[]>>;
    Crear: (data: IUpsertCategoriaDto) => Promise<InterfaceController<ICategoriaProductoDto>>;
    Actualizar: (id: number, data: IUpsertCategoriaDto) => Promise<InterfaceController<ICategoriaProductoDto>>;
    Eliminar: (id: number) => Promise<InterfaceController<unknown>>;
}
