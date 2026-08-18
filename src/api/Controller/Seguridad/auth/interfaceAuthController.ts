import { IDropBoxGlobal } from "../../../../helper/VariablesGLobal";

export interface LoginPostApp {
  email: string;
  password: string;
  // Datos del token de notificaciones (FCM web). Opcionales: si el navegador no
  // da permiso el login viaja sin ellos, igual que en la app movil.
  token?: string | null;
  dispositivo?: string;
  tipoToken?: string;
  plataforma?: string;
}

export const valuedefaultLoginPost: LoginPostApp = {
  email: "",
  password: "",
};

export interface TokenApp {
  idUser: number;
  userName: string;
  email: string;
  idEmpresa: number;
  idSucursal: number;
  isDuenio: boolean;
  token: string;
}

export const TokenAppDefault = {
  idUser: 0,
  userName: "",
  email: "",
  idEmpresa: 0,
  idSucursal: 0,
  isDuenio: false,
  token: "",
};

export interface IdetailResponseApi extends TokenApp {}
export interface TokenResponseApi {
  message: string;
  detail: IdetailResponseApi | null;
  success: boolean;
  status: number;
}

export interface ILogin extends LoginPostApp {
  loading: boolean;
  err: string;
  disabled: boolean;
  validate: boolean | undefined;
  setShowPassword: boolean
}

export const LoginDataDefualt: ILogin = {
  email: "",
  password: "",
  loading: false,
  err: "",
  disabled: false,
  validate: false,
  setShowPassword: false
};

export interface IRoles {
  idRoluser: number;
  nombreRolUser: string;
  nombreUsuario: string;
  nombreEmpresa: String;
  idEmpresa:number
  idSucursal: number;
  isGlobal: boolean;
  logoEmpresa:string;
  permisosUser: number[];
  idPlanCompany: number;
  nombrePlan: string;
  permisosCompany: number[];
}

export interface IdataDefaultToken {
  loading: boolean;
  disabled: boolean;
  DropDown: IDropBoxGlobal[];
  modal: boolean;
  validate: boolean;
  reiniciarGetData: boolean;
  TokenApp: TokenApp;
}

//prettier-ignore
export const dataDefaultToken:  IdataDefaultToken = {
  loading: false,
  disabled: false,
  modal: false,
  validate: false,
  reiniciarGetData: false,
  DropDown: [],
  TokenApp: TokenAppDefault
};
