import { Fragment, useEffect } from 'react'
import Header from '../Components/Layouts/Header/Header';
import Switcher from '../Components/Layouts/Switcher/Switcher';
import Sidebar from '../Components/Layouts/Sidebar/Sidebar';
import Rightside from '../Components/Layouts/Rightside/Rightside';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/Layouts/Footer/Footer';
import BacktoTop from '../Components/Layouts/BacktoTop/BacktoTop';
import { Provider } from 'react-redux';
import store from '../Components/CommonFileComponents/redux/store';
import { useWebPushNotifications } from '../Hooks/useWebPushNotifications';

export const RightSideBarclose = () => {
    //rightsidebar close function
    document.querySelector(".sidebar-right")?.classList.remove("sidebar-open");

    //SwitcherMenu close function
    document.querySelector(".demo_changer")?.classList.remove("active");
    let demo: any = document.querySelector(".demo_changer")
    demo.style.right = '-270px'

    if (document.querySelector(".card.search-result") != null) {
        document.querySelector(".card.search-result")?.classList.add("d-none")
    }

};
const OutletPrivateRoute = () => {
    // Mantiene vivo el listener de FCM mientras se usa el panel: si no, las
    // notificaciones que llegan con la pestana abierta no se mostrarian.
    useWebPushNotifications();

    return (
        <>
            <Fragment>
                <Provider store={store}>
                    <div className='horizontalMenucontainer'>
                        <div className="page custom-index">
                            <Switcher />
                            <Header />
                            <div className="sticky" style={{ paddingTop: "-63px" }}>
                                <Sidebar />
                            </div>
                            <div className="jumps-prevent" style={{ paddingTop: "63px" }}></div>
                            <div className="main-content app-content" onClick={() => RightSideBarclose()}>
                                <div className="main-container container-fluid" >
                                    <Outlet />
                                </div>
                            </div>
                            <Footer />
                        </div>
                        <Rightside />
                        <BacktoTop />
                    </div>
                </Provider>
            </Fragment>
        </>

    );
}

export default OutletPrivateRoute;
