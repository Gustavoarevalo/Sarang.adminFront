import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_API } from "./url";
import { useAuth } from "./Controller/Seguridad/auth/authController";

const instance = axios.create({
  baseURL: BASE_API,
});

// prettier-ignore
const GetArchivos = async <T extends unknown>(endpoint: string, mmtypes:string, authorized: boolean = true, params?: object): Promise<T> => {
  const { getLogin } = useAuth();
  
    if (authorized) {
        instance.interceptors.request.use((config) => {
            config.headers.Authorization = `${getLogin().token}`;
            return config;
        });
    }
    return await instance
        .get(endpoint, {
            params: {
            //cacheBustTimestamp: Date.now(),
            }, responseType: 'blob',        
            headers: {
                Accept:  mmtypes,
            },
        })
        .then(({ data }: AxiosResponse<T>) => {
            if (import.meta.env.VITE_IsDevelopment) {
                return data;
            }
            return data;
          })
        .catch((error: AxiosError<any>) => {
            if (import.meta.env.VITE_IsDevelopment) {
                console.log("Error en la solicitud GetArchivos:", JSON.stringify(error, null, 3));
              }
            throw error;
        });
};

export default GetArchivos;
