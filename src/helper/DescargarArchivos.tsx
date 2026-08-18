import mime from "mime";

//prettier-ignore
export const DescargadeArchivosLocal = async (archivo: Blob, extension: string, nombre?: string): Promise<boolean> => {
    try {
        const url = window.URL.createObjectURL(archivo);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${nombre ? nombre : 'file'}.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return true;
    } catch (error: any) {
        return false;
    }
};

export const obtenerExtensionArchivo = (url: string) => {
    const indicePunto = url.lastIndexOf(".");
    if (indicePunto === -1) {
        return null;
    }

    const extension = url.slice(indicePunto + 1);

    const mimeType = mime.getType(extension);

    return { extension, mimeType };
};
