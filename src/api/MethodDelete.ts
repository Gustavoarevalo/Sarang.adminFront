import { AxiosError, AxiosResponse } from "axios";
import { instance } from "./url";
import { useAuth } from "./Controller/Seguridad/auth/authController";

//prettier-ignore
const Delete = async <T extends unknown>(endpoint: string,  id: string | number,  authorized: boolean = true,  params?: object): Promise<T> => {
  const { getLogin } = useAuth();
  if (authorized) {
    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${getLogin().token}`;
      return config;
    });
  }
  return await instance
    .delete(endpoint + `${id}`, { params })
    .then(({ data }: AxiosResponse<T>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        return data;
      }
      return data;
    })
    .catch((error: AxiosError<any>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        console.log("Error en la solicitud DELETE:", JSON.stringify(error, null, 3));
      }
      //  ShowAlertApiError(error);
      throw error;
    })
    .finally(() => {
      //    setIsLoading(false);
    });
};

export default Delete;
