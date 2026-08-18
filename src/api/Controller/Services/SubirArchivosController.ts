import { postFileRequest } from "../../postFileRequest";
import { UrlArchivosEndpoints } from "../../url";
import { InterfaceController } from "../../InterfaceController";

export interface IArchivoStorageDto {
    idArchivoStorageEntitys: number;
    urlArchivo: string;
    nombreOriginal: string;
    contentType: string;
    extension: string;
}

export const UseSubirArchivos = (): UseSubirArchivosProps => {

    const Subir = async (archivo: File, nombreCarpeta: string) => {
        const formData = new FormData();
        formData.append('File', archivo);
        formData.append('NombreCarpeta', nombreCarpeta);

        try {
            //prettier-ignore
            const response = await postFileRequest<InterfaceController<IArchivoStorageDto>>(UrlArchivosEndpoints.SubirArchivo, formData);
            return Promise.resolve(response);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return { Subir };
};

export interface UseSubirArchivosProps {
    Subir: (archivo: File, nombreCarpeta: string) => Promise<InterfaceController<IArchivoStorageDto>>;
}
