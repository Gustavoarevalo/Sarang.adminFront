import { lazy } from "react";

// -------------- Tienda --------------------- //
const DashboardPage = lazy(() => import("../../../pages/Dashboard/DashboardPage"));
const PedidosPage = lazy(() => import("../../../pages/Pedidos/PedidosPage"));
const SendificoPage = lazy(() => import("../../../pages/Sendifico/SendificoPage"));
// -------------- Inventario --------------------- //
const ProductosPage = lazy(() => import("../../../pages/Productos/ProductosPage"));
const LotesPage = lazy(() => import("../../../pages/Lotes/LotesPage"));
const InventarioPage = lazy(() => import("../../../pages/Inventario/InventarioPage"));
// -------------- Comercial --------------------- //
const PromocionesPage = lazy(() => import("../../../pages/Promociones/PromocionesPage"));
const DescuentosPage = lazy(() => import("../../../pages/Descuentos/DescuentosPage"));
// -------------- Catalogos --------------------- //
const CategoriasPage = lazy(() => import("../../../pages/Catalogos/Categorias/CategoriasPage"));
const ImpuestosPage = lazy(() => import("../../../pages/Catalogos/Impuestos/ImpuestosPage"));
const IvaPage = lazy(() => import("../../../pages/Catalogos/Iva/IvaPage"));
const CostosEnvioPage = lazy(() => import("../../../pages/Catalogos/CostosEnvio/CostosEnvioPage"));
// -------------- Configuracion --------------------- //
const ConfiguracionPage = lazy(() => import("../../../pages/Configuracion/ConfiguracionPage"));

export type TypePlanPermiso = "free"
export type TyperPermiUser = "Perfil" | "free"

export interface MenuItem {
    title: string;
    icon?: JSX.Element;
    type: 'link' | 'sub';
    active: boolean;
    path?: string;
    selected?: boolean;
    badge?: string;
    badgetxt?: string;
    children?: MenuItem[];
    permisoUsuario?: number | TyperPermiUser
    hidden?: boolean
    element?: React.ReactNode
}

export interface MenuGroup {
    menutitle: string;
    Items: MenuItem[];
    permisoPlan: number | TypePlanPermiso
}

export type Menu = MenuGroup[];

const Icon = (path: string) => (
    <i className={`bi ${path} fs-5 me-2`}></i>
);

export const MENUITEMS: Menu = [
    {
        menutitle: "Tienda",
        permisoPlan: 'free',
        Items: [
            {
                title: 'Dashboard',
                icon: Icon('bi-house-fill'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}dashboard`,
                selected: false,
                element: <DashboardPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Pedidos',
                icon: Icon('bi-bag-check-fill'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}pedidos`,
                selected: false,
                element: <PedidosPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Sendifico',
                icon: Icon('bi-truck'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}sendifico`,
                selected: false,
                element: <SendificoPage />,
                permisoUsuario: "free",
                hidden: true,
            },
        ],
    },
    {
        menutitle: "Inventario",
        permisoPlan: 'free',
        Items: [
            {
                title: 'Productos',
                icon: Icon('bi-box-seam'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}productos`,
                selected: false,
                element: <ProductosPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Lotes',
                icon: Icon('bi-boxes'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}lotes`,
                selected: false,
                element: <LotesPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Inventario',
                icon: Icon('bi-clipboard-data'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}inventario`,
                selected: false,
                element: <InventarioPage />,
                permisoUsuario: "free",
                hidden: true,
            },
        ],
    },
    {
        menutitle: "Comercial",
        permisoPlan: 'free',
        Items: [
            {
                title: 'Promociones',
                icon: Icon('bi-stars'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}promociones`,
                selected: false,
                element: <PromocionesPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Descuentos',
                icon: Icon('bi-tags-fill'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}descuentos`,
                selected: false,
                element: <DescuentosPage />,
                permisoUsuario: "free",
                hidden: true,
            },
        ],
    },
    {
        menutitle: "Catálogos",
        permisoPlan: 'free',
        Items: [
            {
                title: 'Categorias',
                icon: Icon('bi-grid-fill'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}categorias`,
                selected: false,
                element: <CategoriasPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Impuestos',
                icon: Icon('bi-percent'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}impuestos`,
                selected: false,
                element: <ImpuestosPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'IVA',
                icon: Icon('bi-receipt'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}iva`,
                selected: false,
                element: <IvaPage />,
                permisoUsuario: "free",
                hidden: true,
            },
            {
                title: 'Costos de envío',
                icon: Icon('bi-truck'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}costos-envio`,
                selected: false,
                element: <CostosEnvioPage />,
                permisoUsuario: "free",
                hidden: true,
            },
        ],
    },
    {
        menutitle: "Configuración",
        permisoPlan: 'free',
        Items: [
            {
                title: 'Configuracion',
                icon: Icon('bi-gear-fill'),
                type: 'link',
                active: false,
                path: `${import.meta.env.BASE_URL}configuracion`,
                selected: false,
                element: <ConfiguracionPage />,
                permisoUsuario: "free",
                hidden: true,
            },
        ],
    },
];
