import axios from "axios";

const apibase = "/api/";

export const BASE_API = `${import.meta.env.VITE_BACK_URL ?? ''}`;

/*
  ==============================
  REGION: Seguridad
  ==============================
*/

export const UrlBasicLogin: string = `${apibase}Login`;
export const URlLogin = {
  login: `${UrlBasicLogin}/LoginDuenio`,
  registerDuenio: `${UrlBasicLogin}/RegisterDuenio`,
  rolesYPermisos: `${apibase}Roles`,
  ChangePassword: `${UrlBasicLogin}/CambiarContraseniaUserGlobal`,
  CerrarSesion: `${UrlBasicLogin}/CerrarSesion`,
};

/*
  ==============================
  REGION: DropDowns
  ==============================
*/

export const UrlDropDownsAdmin: string = `${apibase}DropDowns`;
export const UrlDropDownsEndpoints = {
  EnumTipoProducto: `${UrlDropDownsAdmin}/EnumTipoProducto`,
  EnumTipoImpuesto: `${UrlDropDownsAdmin}/EnumTipoImpuesto`,
  EnumEstadoRecepcion: `${UrlDropDownsAdmin}/EnumEstadoRecepcion`,
  CategoriaProducto: `${UrlDropDownsAdmin}/CategoriaProducto`,
};

/*
  ==============================
  REGION: Administracion de tienda
  ==============================
*/

export const UrlProductsAdmin: string = `${apibase}ProductAdmin`;
export const UrlProductsEndpoints = {
  ListarTodosProductos: `${UrlProductsAdmin}/ListarTodosProductos`,
  CrearProducto: `${UrlProductsAdmin}/CrearProducto`,
  ActualizarProducto: `${UrlProductsAdmin}/ActualizarProducto`,
  EliminarProducto: `${UrlProductsAdmin}/EliminarProducto/`,
};

export const UrlPromocionesAdmin: string = `${apibase}PromocionesAdmin`;
export const UrlPromocionesEndpoints = {
  ListarPromociones: `${UrlPromocionesAdmin}/ListarPromociones`,
  CrearPromocion: `${UrlPromocionesAdmin}/CrearPromocion`,
  ActualizarPromocion: `${UrlPromocionesAdmin}/ActualizarPromocion`,
  ReponerPromocion: `${UrlPromocionesAdmin}/ReponerPromocion/`,
};

export const UrlDescuentosAdmin: string = `${apibase}DescuentoAdmin`;
export const UrlDescuentosEndpoints = {
  ListarTodosDescuentos: `${UrlDescuentosAdmin}/ListarTodosDescuentos`,
  CrearDescuento: `${UrlDescuentosAdmin}/CrearDescuento`,
  ActualizarDescuento: `${UrlDescuentosAdmin}/ActualizarDescuento`,
  EliminarDescuento: `${UrlDescuentosAdmin}/EliminarDescuento/`,
};

export const UrlLotesAdmin: string = `${apibase}LoteAdmin`;
export const UrlLotesEndpoints = {
  ListarTodosLotes: `${UrlLotesAdmin}/ListarTodosLotes`,
  CrearLote: `${UrlLotesAdmin}/CrearLote`,
  ActualizarLote: `${UrlLotesAdmin}/ActualizarLote`,
};

export const UrlConfiguracionAdmin: string = `${apibase}ConfiguracionAdmin`;
export const UrlConfiguracionEndpoints = {
  Obtener: `${UrlConfiguracionAdmin}/Obtener`,
  Guardar: `${UrlConfiguracionAdmin}/Guardar`,
};

/*
  ==============================
  REGION: Catalogos
  ==============================
*/

export const UrlCategoriasAdmin: string = `${apibase}CategoriasProducto`;
export const UrlCategoriasEndpoints = {
  ListarCategorias: `${UrlCategoriasAdmin}/ListarCategorias`,
  CrearCategoria: `${UrlCategoriasAdmin}/CrearCategoria`,
  ActualizarCategoria: `${UrlCategoriasAdmin}/ActualizarCategoria`,
  EliminarCategoria: `${UrlCategoriasAdmin}/EliminarCategoria/`,
};

export const UrlImpuestosAdmin: string = `${apibase}Impuestos`;
export const UrlImpuestosEndpoints = {
  ListarImpuestos: `${UrlImpuestosAdmin}/ListarImpuestos`,
  CrearImpuesto: `${UrlImpuestosAdmin}/CrearImpuesto`,
  ActualizarImpuesto: `${UrlImpuestosAdmin}/ActualizarImpuesto`,
  EliminarImpuesto: `${UrlImpuestosAdmin}/EliminarImpuesto/`,
};

export const UrlIvaAdmin: string = `${apibase}Iva`;
export const UrlIvaEndpoints = {
  ListarIvas: `${UrlIvaAdmin}/ListarIvas`,
  CrearIva: `${UrlIvaAdmin}/CrearIva`,
  ActualizarIva: `${UrlIvaAdmin}/ActualizarIva`,
  EliminarIva: `${UrlIvaAdmin}/EliminarIva/`,
};

/*
  ==============================
  REGION: Servicios
  ==============================
*/

export const UrlArchivosAdmin: string = `${apibase}SubirArchivos`;
export const UrlArchivosEndpoints = {
  SubirArchivo: `${UrlArchivosAdmin}/SubirArchivo`,
};

export const instance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});
