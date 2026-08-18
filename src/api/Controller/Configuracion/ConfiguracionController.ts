import Get from "../../Methodget";
import { putFileRequest } from "../../putFileRequest";
import { UrlConfiguracionEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";

export interface IConfiguracionImagenDto {
    id: number;
    idArchivoStorageEntitys: number;
    type: string;
    uri: string;
    altText: string;
    title: string;
    description: string;
    isCover: boolean;
}

export interface IConfiguracionDto {
    id: number;
    envioGratisActivo: boolean;
    envioGratisDesde: number;
    stockMinimoAlerta: number;
    ivaVentaPorcentaje: number;
    moneda: string;
    imagenes: IConfiguracionImagenDto[];
}

export const DataDefaultConfiguracion: IConfiguracionDto = {
    id: 0,
    envioGratisActivo: false,
    envioGratisDesde: 0,
    stockMinimoAlerta: 0,
    ivaVentaPorcentaje: 0,
    moneda: '',
    imagenes: [],
};

export const UseConfiguracion = (): UseConfiguracionProps => {

    const Obtener = async () => {
        try {
            //prettier-ignore
            const response = await Get<InterfaceController<IConfiguracionDto>>(UrlConfiguracionEndpoints.Obtener);
            return Promise.resolve(response.detail);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const Guardar = async (data: FormData) => {
        try {
            //prettier-ignore
            const response = await putFileRequest<InterfaceController<IConfiguracionDto>>(UrlConfiguracionEndpoints.Guardar, data);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Obtener, Guardar };
};

export interface UseConfiguracionProps {
    Obtener: () => Promise<IConfiguracionDto>;
    Guardar: (data: FormData) => Promise<InterfaceController<IConfiguracionDto>>;
}
