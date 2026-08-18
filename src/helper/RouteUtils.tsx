import { MenuGroup, MenuItem } from "../Components/Layouts/Sidebar/SideBarMenu";

interface IRoutePath {
    name: string;
    path: string;
    element: JSX.Element;
}

//prettier-ignore
export const generateRoutesFromMenu = (menuGroups: MenuGroup[], permisosGlobal: number[], permisosCompany: number[], IsGlobal: boolean): IRoutePath[] => {
    const routes: IRoutePath[] = [];

    menuGroups.forEach((group) => {
        if (
            group.permisoPlan === "free" ||
            (typeof group.permisoPlan === 'number' && permisosCompany.includes(group.permisoPlan))
        ) {
            group.Items.forEach((item) => {
                if (item.type === 'sub' && Array.isArray(item.children)) {
                    item.children.forEach((child) => {
                        if (
                            ((typeof child.permisoUsuario === 'number' && permisosGlobal.includes(child.permisoUsuario)) || (typeof child.permisoUsuario === 'number' && IsGlobal === true)) ||
                            child.permisoUsuario === "Perfil" || child.permisoUsuario === "free"
                        ) {
                            if (child.path && child.element) {
                                routes.push({
                                    name: child.title,
                                    path: child.path,
                                    element: child.element as JSX.Element,
                                });
                            }
                        }
                    });
                } else {
                    if (((typeof item.permisoUsuario === 'number' && permisosGlobal.includes(item.permisoUsuario)) || (typeof item.permisoUsuario === 'number' && IsGlobal === true)) ||
                        item.permisoUsuario === "Perfil" || item.permisoUsuario === "free"
                    ) {
                        if (item.path && item.element) {
                            routes.push({
                                name: item.title,
                                path: item.path,
                                element: item.element as JSX.Element,
                            });
                        }
                    }
                }
            });
        }
    });
    return routes;
};

//prettier-ignore
export const filterMenuGroupsByPermissions = (menuGroups: MenuGroup[], globalPermissionsUser: number[], companyPermissions: number[], IsGlobal: boolean): MenuGroup[] => {
    return menuGroups
        .map((group) => {
            const filteredItems: MenuItem[] = group.Items.filter((item) => {
                const hasUserPermission = IsGlobal ? true :
                    typeof item.permisoUsuario === 'number'
                        ? globalPermissionsUser.includes(item.permisoUsuario)
                        : item.permisoUsuario === "Perfil" || item.permisoUsuario === "free";

                // const hasCompanyPermission =
                //     typeof item.permisoUsuario === 'number' ? companyPermissions.includes(item.permisoUsuario)
                //         : item.permisoUsuario === "Perfil" || item.permisoUsuario === "free";

                const hasPlanPermission =
                    group.permisoPlan === "free" || companyPermissions.includes(group.permisoPlan as number);


                return item.hidden && hasUserPermission && hasPlanPermission;// && hasCompanyPermission 
            });

            return {
                ...group,
                Items: filteredItems,
            };
        })
        .filter((group) => group.Items.length > 0);
};