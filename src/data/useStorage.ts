import { TokenApp } from "../api/Controller/Seguridad/auth/interfaceAuthController";
import { useBaseStorage } from "./useBaseStorage";
const keyStorage = {
  token: "Sas-auth-token",
};
export const useStorage = () => {
  const { SaveData, GetData, RemoveData } = useBaseStorage();

  const SaveToken = (data: TokenApp) => {
    const adapter: TokenApp = {
      idUser: data.idUser,
      userName: data.userName,
      email: data.email,
      idEmpresa: data.idEmpresa,
      idSucursal: data.idSucursal,
      isDuenio: data.isDuenio,
      token: data.token,
    };
    SaveData(adapter, keyStorage.token);
  };

  const GetToken = (): TokenApp => GetData<TokenApp>(keyStorage.token);

  const RemoveToken = () => {
    RemoveData(keyStorage.token);
  };

  return {
    SaveToken,
    GetToken,
    RemoveToken,
  };
};
