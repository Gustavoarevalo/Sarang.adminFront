//prettier-ignore
import Get from "../../../Methodget";
import { useStorage } from "../../../../data/useStorage";
import Post from "../../../MethodPost";
//prettier-ignore
import { IRoles, LoginPostApp, TokenApp, TokenResponseApi } from "./interfaceAuthController";
import { URlLogin } from "../../../url";

export interface LoginPostApi {
  email: string;
  password: string;
}

export const useAuth = (): UseLogin => {
  const { SaveToken, GetToken, RemoveToken } = useStorage();

  const setLogin = async (viewModel: LoginPostApp) => {
    try {
      //prettier-ignore
      const response: TokenResponseApi = await Post<TokenResponseApi>(URlLogin.login,
        {
          email: viewModel.email,
          password: viewModel.password,
          // El back registra el token en Redis (via RabbitMQ) para poder mandar
          // notificaciones push a este navegador.
          token: viewModel.token ?? null,
          dispositivo: viewModel.dispositivo ?? "",
          tipoToken: viewModel.tipoToken ?? "",
          plataforma: viewModel.plataforma ?? "",
        },
        false
      );
      if (response.detail && response.detail.token) {
        SaveToken(response.detail);
        return Promise.resolve(response.detail);
      }
    } catch (err: unknown) {
      return Promise.reject(err);
    }
  };

  const getPermisosUser = async () => {
    try {
      const rol = await Get<IRoles>(URlLogin.rolesYPermisos);
      //prettier-ignore
      const DataObject: IRoles = {
        idRoluser: rol.idRoluser ?? 0,
        nombreRolUser: rol.nombreRolUser ?? "",
        nombreUsuario: rol.nombreUsuario ?? "",
        isGlobal: rol.isGlobal ?? false,
        permisosUser: rol.permisosUser ?? [],
        // El backend de la tienda no maneja empresa/plan: se completan con valores por defecto
        // para no romper los componentes del layout que los leen.
        nombreEmpresa: rol.nombreEmpresa ?? "",
        idEmpresa: rol.idEmpresa ?? 0,
        idSucursal: rol.idSucursal ?? 0,
        logoEmpresa: rol.logoEmpresa ?? "",
        idPlanCompany: rol.idPlanCompany ?? 0,
        nombrePlan: rol.nombrePlan ?? "",
        permisosCompany: rol.permisosCompany ?? [],
      };
      return Promise.resolve(DataObject);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const getLogin = () => GetToken();

  const removeLogin = () => RemoveToken();

  const logout = async () => {
    try {
      const response: TokenResponseApi = await Get<TokenResponseApi>(URlLogin.CerrarSesion);
      //prettier-ignore
      await removeLogin()
      return Promise.resolve(response);
    } catch (err) {
      removeLogin();
      return Promise.reject(err);
    }
  };

  return { getLogin, setLogin, getPermisosUser, removeLogin, logout };
};

interface UseLogin {
  getLogin: () => TokenApp;
  removeLogin: () => void;
  setLogin: (viewModel: LoginPostApp) => Promise<any>;
  getPermisosUser: () => Promise<IRoles>;
  logout: () => Promise<TokenResponseApi>;
}
