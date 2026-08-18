import { AxiosError, AxiosResponse } from "axios";
import { instance } from "./url";
import { useAuth } from "./Controller/Seguridad/auth/authController";

//prettier-ignore
const Put = async <T extends unknown>(  endpoint: string,  data?: object,  authorized: boolean = true,  params?: object): Promise<T> => {
  const { getLogin } = useAuth();
  const getToken = getLogin();
  if (authorized && getToken) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${getLogin().token}`;
      return config;
    });
  }
  return await instance
    .put(endpoint, data, { params })
    .then(({ data }: AxiosResponse<T>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        return data;
      }
      return data;
    })
    .catch((error: AxiosError<any>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        console.log("Error en la solicitud PUT:", JSON.stringify(error, null, 3));
      }
      //  ShowAlertApiError(error);
      throw error;
    })
    .finally(() => {
      //    setIsLoading(false);
    });
};

export default Put;
