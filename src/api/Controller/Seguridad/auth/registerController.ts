import { ICambiarContrasenia } from "../../../../Components/Layouts/Header/Header";
import Post from "../../../MethodPost";
import { URlLogin } from "../../../url";
import { ApiResponse } from "../../InterfaceController";
import { TokenResponseApi } from "./interfaceAuthController";

export interface RegisterPostApi {
  username: string;
  email: string;
  password: string;
}

export const useRegister = (): UseRegister => {
  const setRegister = async (viewModel: RegisterPostApi) => {
    try {
      //prettier-ignore
      const response: TokenResponseApi = await Post<TokenResponseApi>(URlLogin.registerDuenio, {
        username: viewModel.username,
        email: viewModel.email,
        password: viewModel.password,
      }
      );

      return Promise.resolve(response);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const ChangePassword = async (viewModel: ICambiarContrasenia) => {
    try {
      //prettier-ignore
      const response= await Post<ApiResponse<null>>(URlLogin.ChangePassword, {
        contraseniaActual: viewModel.contraseniaActual,
        nuevaContrasenia: viewModel.nuevaContrasenia,
      }
      );

      return Promise.resolve(response);
    } catch (err) {
      return Promise.reject(err);
    }
  };


  return { setRegister,  ChangePassword };
};

interface UseRegister {
  setRegister: (viewModel: RegisterPostApi) => Promise<TokenResponseApi>;
   ChangePassword: (viewModel: ICambiarContrasenia) => Promise<ApiResponse<null>>;
}
