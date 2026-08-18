import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_API } from "./url";
import { useAuth } from "./Controller/Seguridad/auth/authController";

//prettier-ignore
export const putFileRequest = async <T extends unknown>(endpoint: string, data?: object, params?: object): Promise<T> => {
  //Loader.show();

  const { getLogin } = useAuth();

  const ApiPostFileRequest = axios.create({
    baseURL: BASE_API,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getLogin().token}`
    },
  });

  return await ApiPostFileRequest.put(endpoint, data, { params })
    .then(({ data }: AxiosResponse<T>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        return data;
      }
      return data;
    })
    .catch((error: AxiosError<any>) => {
      if (import.meta.env.VITE_IsDevelopment) {
        console.log("Error en la solicitud putFileRequest:", JSON.stringify(error, null, 3));
      }
      throw error;
    })
    .finally(() => {
      //
    });
};
