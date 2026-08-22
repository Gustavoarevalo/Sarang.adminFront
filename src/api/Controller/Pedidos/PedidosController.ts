import Get from "../../Methodget";
import Put from "../../MethodPut";
import { UrlPedidosEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";
import { IgetApiResponseProps } from "../../../helper/VariablesGLobal";
//prettier-ignore
import { IActualizarPedidoDto, IFilterPedidosAdminDto, IPedidoAdminDto } from "./InterfacePedidos";

export const UsePedidos = (): UsePedidosProps => {
    const Listar = async (filter: IFilterPedidosAdminDto) => {
        let url = UrlPedidosEndpoints.ListarPedidos;
        const params = new URLSearchParams();

        if (filter.estado != null) {
            params.append("Estado", filter.estado.toString());
        }
        if (filter.desde) {
            params.append("Desde", filter.desde);
        }
        if (filter.hasta) {
            params.append("Hasta", filter.hasta);
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
            const response = await Get<InterfaceController<IgetApiResponseProps<IPedidoAdminDto[]>>>(url);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Actualizar = async (data: IActualizarPedidoDto) => {
        try {
            //prettier-ignore
            const response = await Put<InterfaceController<IPedidoAdminDto>>(UrlPedidosEndpoints.ActualizarPedido, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Listar, Actualizar };
};

interface UsePedidosProps {
    Listar: (filter: IFilterPedidosAdminDto) => Promise<IgetApiResponseProps<IPedidoAdminDto[]>>;
    Actualizar: (data: IActualizarPedidoDto) => Promise<InterfaceController<IPedidoAdminDto>>;
}
