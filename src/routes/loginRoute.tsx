import React, { Fragment, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GrowExample from '../Components/components/switch/spinner';

const Auth = lazy(() => import('../Authentication/SignAuth'));

const SignIn = lazy(() => import('../Authentication/SignIn'));

const LoginRoute = () => {
    return (
        <Fragment>
            <BrowserRouter>
                <React.Suspense fallback={<GrowExample />}>
                    <Routes>
                        <Route path={`${import.meta.env.BASE_URL}`} element={<Auth />}>
                            <Route index element={<SignIn />} />
                            <Route path={`${import.meta.env.BASE_URL}Authentication/SignIn`} element={<SignIn />} />
                            <Route path={`${import.meta.env.BASE_URL}*`} element={<SignIn />} />
                        </Route>
                    </Routes>
                </React.Suspense>
            </BrowserRouter>
        </Fragment>

    );
}

export default LoginRoute;
