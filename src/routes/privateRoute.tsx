import React, { Fragment, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PermisosGlobalStore } from '../store/PermisosGlobalStore';
import { generateRoutesFromMenu } from '../helper/RouteUtils';
import { MENUITEMS } from '../Components/Layouts/Sidebar/SideBarMenu';
import GrowExample from '../Components/components/switch/spinner';

const Error500 = lazy(() => import('../Components/Pages/CustomPages/Error500/Error500'));
const OutletPrivateRoute = lazy(() => import('./outletPrivateRoute'))
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));

const PrivateRoute = () => {
    const permisos = PermisosGlobalStore()
    return (
        <Fragment>

            <BrowserRouter>
                <React.Suspense fallback={<GrowExample />}>
                    <Routes>

                        {/* Components Routes */}

                        <Route path={`${import.meta.env.BASE_URL}`} element={<OutletPrivateRoute />}>
                            <Route index element={<DashboardPage />} />

                            {/* Main */}

                            {/* <Route path={`${import.meta.env.BASE_URL}`} element={<Indexpage />} /> */}

                            {/*Seguridad */}
                            <Route>
                                {generateRoutesFromMenu(MENUITEMS, permisos.PermisosGlobal.permisosUser, permisos.PermisosGlobal.permisosCompany, permisos.PermisosGlobal.isGlobal).map((e, index) => {
                                    return (
                                        <Route key={index} path={`${import.meta.env.BASE_URL}${e.path}`} element={e.element} />
                                    )
                                })}
                                <Route path={`${import.meta.env.BASE_URL}*`} element={<Error500 />} />
                            </Route>
                        </Route>

                    </Routes>

                </React.Suspense>
            </BrowserRouter>
        </Fragment>

    );
}

export default PrivateRoute;
//:id