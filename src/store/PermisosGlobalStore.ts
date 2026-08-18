import { IRoles } from "../api/Controller/Seguridad/auth/interfaceAuthController";
import { create } from "zustand";

interface IDataPermisosGlobal extends IRoles { }

export const DataPermisosGlobal: IDataPermisosGlobal = {
  idRoluser: 0,
  nombreRolUser: "",
  nombreUsuario: "",
  nombreEmpresa: "",
  isGlobal: false,
  permisosUser: [],
  idPlanCompany: 0,
  nombrePlan: "",
  permisosCompany: [],
  idEmpresa:0,
  idSucursal: 0,
  logoEmpresa: ""
};

interface IpermisosGlobal {
  PermisosGlobal: IDataPermisosGlobal;
  SetPermisosGlobal: (v: IDataPermisosGlobal) => void;
  hasPermission: (permiso: number) => boolean;
}

export const PermisosGlobalStore = create<IpermisosGlobal>((set, get) => ({
  PermisosGlobal: DataPermisosGlobal,
  SetPermisosGlobal: (v: IDataPermisosGlobal) => set({ PermisosGlobal: v }),
  hasPermission: (permiso: number) => {
    const { PermisosGlobal } = get();
    if (PermisosGlobal.isGlobal) return true;
    return PermisosGlobal.permisosUser.includes(permiso);
  },
}));
