import axios from "axios";
import { useAuth } from "./Controller/Seguridad/auth/authController";
import { BASE_API } from "./url";

const instance = axios.create({
  baseURL: BASE_API,
});

//prettier-ignore
const GetArchivosPDF = async <T extends unknown>(  endpoint: string,  mmtypes: string,  authorized: boolean = true,  params?: object): Promise<T> => {
  const { getLogin } = useAuth();

  if (authorized) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${getLogin().token}`;
      return config;
    });
  }

  try {
    const response = await instance.get(endpoint, {
      params: {
        // cacheBustTimestamp: Date.now(),
      },
      responseType: "blob",
      headers: {
        Accept: mmtypes,
      },
    });
    if(import.meta.env.VITE_IsDevelopment){
      return response.data;
    }

    // Check if response status is in the range of 200-299
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error("La solicitud no pudo ser completada.");
    }
  } catch (error) {
    if (import.meta.env.VITE_IsDevelopment) {
      console.error("Error en la solicitud (PDF):", error);
    }
    throw error;
  }
};

export default GetArchivosPDF;
