import axios, { AxiosError, AxiosResponse, AxiosResponseHeaders } from "axios";
import { useAuth } from "./Controller/Seguridad/auth/authController";
import { BASE_API } from "./url";
import { ClassNames } from "@emotion/react";

const instance = axios.create({
  baseURL: BASE_API,
});

//prettier-ignore
const setupAxiosForDownload = (authorized = true, mmtypes = 'application/octet-stream') => {
  const { getLogin } = useAuth();
  if (authorized) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `${getLogin().token}`;
      config.headers.Accept = mmtypes;
      return config;
    });
  } else {
    instance.interceptors.request.use(config => config); 
  }
};

//prettier-ignore
const downloadFile = async (url:string, fileName?:string, mimeType = 'application/octet-stream', authorized = true, params={}) => {
  setupAxiosForDownload(authorized, mimeType);
  try {
    const response = await instance.get(url, { responseType: 'blob', params });

    if (response.data) {
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches) {
          fileName = decodeURIComponent(matches[1]);
        }
      }
      
      const contentType = response.headers['content-type'];

      if (contentType === 'application/pdf' ||
          contentType === 'text/plain' ||
          contentType === 'application/vnd.ms-excel' ||
          contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
      {
        // Descargar archivo PDF, texto plano , excel 
        const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName? fileName : '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else {
        console.log('Tipo de contenido no soportado:', contentType);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default downloadFile;
