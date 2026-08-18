import { Fragment, useState, useEffect, useCallback } from 'react';
import "./Sidebar.module.scss"
import { Link } from "react-router-dom";
import { MENUITEMS } from './SideBarMenu';
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useLocation } from "react-router-dom";
let history: any = [];

// brand images
import logoCea from "../../../../public/images/logo_final_cea_universal_sin_fondo.png"
import logoCeafondo from "../../../../public/images/logoceasinbg.png"
import logo from '../../../assets/img/brand/logo.png';
import logoWhite from '../../../assets/img/brand/logo-white.png';
import favicon from '../../../assets/img/brand/favicon.png';
import faviconWhite from '../../../assets/img/brand/favicon-white.png';
import icon from '../../../assets/img/users/6.jpg';
import ProfileService from '../../CommonFileComponents/service/profile';
import { filterMenuGroupsByPermissions } from '../../../helper/RouteUtils';
import { PermisosGlobalStore } from '../../../store/PermisosGlobalStore';
import { dataDefaultToken, IdataDefaultToken } from '../../../api/Controller/Seguridad/auth/interfaceAuthController';
import { useFillData } from '../../../Hooks/useFilldata';
import ModalChangeLoading from '../../components/ModalChange';
import { useStorage } from '../../../data/useStorage';
import avatar from "../../../../public/images/perfil.jpeg"

export default function Sidebar() {
  const data = useFillData<IdataDefaultToken>(dataDefaultToken);
  const { GetToken } = useStorage();
  const permisos = PermisosGlobalStore();

  const getName = async () => {
    data.updateData(GetToken(), 'TokenApp');
  };


  let location = useLocation();
  const [menuitems, setMenuitems] = useState(filterMenuGroupsByPermissions(MENUITEMS, permisos.PermisosGlobal.permisosUser, permisos.PermisosGlobal.permisosCompany, permisos.PermisosGlobal.isGlobal));
  //const [outPut, setoutPut] = useState(EditProfileService.returnId());
  // initial loading
  useEffect(() => {
    getName();

    history.push(location.pathname);  // add  history to history  stack for current location.pathname to prevent multiple history calls innerWidth  and innerWidth  calls from  multiple users. This is important because the history stack is not always empty when the user clicks  the history       
    if (history.length > 2) {
      history.shift();
    }
    if (history[0] !== history[1]) {
      setSidemenu();
    }
    let mainContent: any = document.querySelector('.main-content');

    //when we click on the body to remove
    mainContent.addEventListener('click', mainContentClickFn);
    return () => {
      mainContent.removeEventListener('click', mainContentClickFn);
    }

  }, [location])

  // location
  useEffect(() => {
    if (document.body.classList.contains('horizontal') && window.innerWidth >= 992) {
      clearMenuActive();
    }
  }, []);

  //  In Horizontal When we click the body it should we Closed using in useEfffect Refer line No:16
  function mainContentClickFn() {
    if (document.body.classList.contains('horizontal') && window.innerWidth >= 992) {
      clearMenuActive();
    }
  }
  //<-------End---->
  function setSidemenu() {
    if (menuitems) {
      menuitems.filter(mainlevel => {
        if (mainlevel.Items) {
          mainlevel.Items.filter((items) => {
            items.active = false;
            items.selected = false;
            if (location.pathname === '/valex-ts/preview/' || location.pathname === '/valex-ts/preview/') {
              location.pathname = '/valex-ts/preview/indexpage';
            }
            if (location.pathname === items.path + '/') {
              items.active = true;
              items.selected = true;
            }
            if (items.children) {
              items.children.filter(submenu => {
                submenu.active = false;
                submenu.selected = false;
                if (location.pathname === submenu.path + '/') {
                  items.active = true;
                  items.selected = true;
                  submenu.active = true;
                  submenu.selected = true;
                }
                if (submenu.children) {
                  submenu.children.filter(submenu1 => {
                    submenu1.active = false;
                    submenu1.selected = false;
                    if (location.pathname === submenu1.path + '/') {
                      items.active = true;
                      items.selected = true;
                      submenu.active = true;
                      submenu.selected = true;
                      submenu1.active = true;
                      submenu1.selected = true;
                    }
                    return submenu1;
                  })
                }
                return submenu;
              })
            }
            return items;
          })
        }
        setMenuitems(arr => [...arr]);
        return mainlevel;
      })
    }
  }

  function toggleSidemenu(item) {

    if (
      !document.body.classList.contains("horizontal-hover") ||
      window.innerWidth < 992
    ) {
      // To show/hide the menu
      if (!item.active) {
        menuitems.filter(mainlevel => {
          if (mainlevel.Items) {
            mainlevel.Items.filter(sublevel => {
              sublevel.active = false;
              if (item === sublevel) {
                sublevel.active = true;
              }
              if (sublevel.children) {
                sublevel.children.filter(sublevel1 => {
                  sublevel1.active = false;
                  if (item === sublevel1) {
                    sublevel.active = true;
                    sublevel1.active = true;
                  }
                  if (sublevel1.children) {
                    sublevel1.children.filter(sublevel2 => {
                      sublevel2.active = false;
                      if (item === sublevel2) {
                        sublevel.active = true;
                        sublevel1.active = true;
                        sublevel2.active = true;
                      }
                      if (sublevel2.children) {
                        sublevel2.children.filter(sublevel3 => {
                          sublevel3.active = false;
                          if (item === sublevel3) {
                            sublevel.active = true;
                            sublevel1.active = true;
                            sublevel2.active = true;
                            sublevel3.active = true;
                          }
                          return sublevel2;
                        })
                      }
                      return sublevel2;
                    })
                  }
                  return sublevel1;
                })
              }
              return sublevel;
            })
          }
          return mainlevel;
        })
      }
      else {
        item.active = !item.active;
      }
    }

    setMenuitems(arr => [...arr]);
  }

  function clearMenuActive() {
    filterMenuGroupsByPermissions(MENUITEMS, permisos.PermisosGlobal.permisosUser, permisos.PermisosGlobal.permisosCompany, permisos.PermisosGlobal.isGlobal).filter(mainlevel => {
      if (mainlevel.Items) {
        mainlevel.Items.filter(sublevel => {
          sublevel.active = false;
          if (sublevel.children) {
            sublevel.children.filter(sublevel1 => {
              sublevel1.active = false;
              if (sublevel1.children) {
                sublevel1.children.filter(sublevel2 => {
                  sublevel2.active = false;
                  if (sublevel2.children) {
                    sublevel2.children.filter(sublevel3 => {
                      sublevel3.active = false;
                      return sublevel3;
                    })
                  }
                  return sublevel2;
                })
              }
              return sublevel1;
            })
          }
          return sublevel;
        })
      }
      return mainlevel;
    })
    setMenuitems(arr => [...arr]);
  }
  //Hover effect
  function Onhover() {
    if (document.querySelector(".app")) {
      if (document.querySelector(".app")?.classList.contains("sidenav-toggled"))
        document.querySelector(".app")?.classList.add("sidenav-toggled-open");
    }
  }
  function Outhover() {
    if (document.querySelector(".app")) {
      document.querySelector(".app")?.classList.remove("sidenav-toggled-open");
    }
  }


  const [faces6, setfaces6] = useState(icon);

  useEffect(() => {
    if (ProfileService.returnImage() != undefined) {
      setfaces6(ProfileService.returnImage())
    }
    //setoutPut(EditProfileService.returnId());
  }, [location])

  return (

    <div
      className="app-sidebar "
      onMouseOver={() => Onhover()}
      onMouseOut={() => Outhover()}
    >
      <ModalChangeLoading open={data.data.loading} />
      <PerfectScrollbar className='hor-scroll bg-white' options={{ suppressScrollX: true, useBothWheelAxes: false }}>
        <div className="main-sidebar-header active">
          <img
            src={logoCea}
            className="desktop-logo logo-light active main-logo"
            alt="logo"
            style={{ width: '46px', height: 'auto' }}
          />

          <Link className='desktop-logo logo-dark active' to={`${import.meta.env.BASE_URL}`}>
            <img
              src={logoCeafondo}
              className="main-logo"
              alt="logo"
              style={{ width: '46px', height: 'auto' }}
            /></Link>
          <Link className='logo-icon mobile-logo icon-light active' to={`${import.meta.env.BASE_URL}`}>
            <img
              src={logoCea}
              className=""
              alt="logo"
              style={{ width: '46px', height: 'auto' }}
            /></Link>
          <Link className='logo-icon mobile-logo icon-dark active' to={`${import.meta.env.BASE_URL}`}>
            <img
              src={logoCeafondo}
              className=""
              alt="logo"
              style={{ width: '46px', height: 'auto' }}
            />
          </Link>
        </div>
        <div className="main-sidemenu mb-1">
          <div className="app-sidebar__user clearfix">
            <div className="dropdown user-pro-body">
              <div className="main-img-user avatar-xl ">
                <img alt="user-img" loading='lazy' src={permisos.PermisosGlobal.logoEmpresa !== '' ? permisos.PermisosGlobal.logoEmpresa : avatar} /><span className="avatar-status profile-status bg-green"></span>
              </div>
              <div className="user-info">
                <h4 className="fw-semibold mt-1 mb-0"> {data.data.TokenApp.userName}</h4>
                <p className='mt-2'>{permisos.PermisosGlobal.nombreRolUser || ''}</p>
              </div>
            </div>
          </div>
          <div className="overflow-auto p-2" style={{ maxHeight: "400px" }}>
            <div className="slide-left disabled" id="slide-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>

            <ul className="side-menu open mb-5 ">
              {filterMenuGroupsByPermissions(MENUITEMS, permisos.PermisosGlobal.permisosUser, permisos.PermisosGlobal.permisosCompany, permisos.PermisosGlobal.isGlobal).map((Item, i) => (
                <Fragment key={i}>
                  <li className="side-item side-item-category">
                    {Item.menutitle}
                  </li>
                  {Item.Items.map((menuItem, i) => (
                    <li
                      className={`slide ${menuItem.active ? "is-expanded" : ""
                        }`}
                      key={i}
                    >
                      {menuItem.type === "link" ? (
                        <Link
                          //id={menuItem.title === "Home" ? "menu-home" : undefined}
                          to={menuItem.path + ""}
                          className={`side-menu__item menu-home${menuItem.active ? "active" : ""
                            }`}
                          onClick={() => {
                            toggleSidemenu(menuItem);
                          }}
                        >
                          {menuItem.icon}
                          <span className="side-menu__label">
                            {menuItem.title}
                          </span>
                        </Link>
                      ) : (
                        ""
                      )}

                      {menuItem.type === "sub" ? (
                        <Link
                          to={menuItem.path + "/"}
                          className={`side-menu__item ${menuItem.active ? "active" : ""
                            }`}
                          onClick={(event) => {
                            event.preventDefault();
                            toggleSidemenu(menuItem);
                          }}
                        >
                          {menuItem.icon}
                          <span className="side-menu__label">
                            {menuItem.title}
                          </span>
                          {menuItem.badge ? (
                            <label className={`${menuItem.badge} side-badge`}>
                              {menuItem.badgetxt}
                            </label>
                          ) : (
                            ""
                          )}
                          <i className="angle fe fe-chevron-down"></i>
                        </Link>
                      ) : (
                        ""
                      )}
                      {menuItem.children ? (
                        <ul
                          className={`slide-menu ${menuItem.active ? "open" : " "
                            }`}
                          style={
                            menuItem.active
                              ? {
                                opacity: 1,
                                transition: "opacity 500ms ease-in",
                                display: "block",
                              }
                              : { display: "none" }
                          }
                        >
                          {menuItem.children.map((childrenItem, index) => {
                            return (
                              <li className='sub-slide' key={index}>
                                {childrenItem.type === "sub" ? (
                                  <Link
                                    to="javascript"
                                    className="slide-item"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      toggleSidemenu(childrenItem);
                                    }}
                                  >
                                    <span className="sub-side-menu__label">
                                      {childrenItem.title}
                                    </span>
                                    {childrenItem.active ? (
                                      <i className="sub-angle  fe fe-chevron-down"></i>
                                    ) : (
                                      <i className="sub-angle fe fe-chevron-right"></i>
                                    )}
                                  </Link>
                                ) : (
                                  ""
                                )}
                                {childrenItem.type === "link" ? (
                                  <Link
                                    to={childrenItem.path + "/"}
                                    className={`slide-item ${childrenItem.active ? "active" : " "
                                      }`}
                                    onClick={() =>
                                      toggleSidemenu(childrenItem)
                                    }
                                  >
                                    {childrenItem.title}
                                  </Link>
                                ) : (
                                  ""
                                )}
                                {childrenItem.children ? (
                                  <ul
                                    className={`sub-slide-menu ${menuItem.active ? "" : "open"
                                      }`}
                                    style={
                                      childrenItem.active
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    {childrenItem.children.map(
                                      (childrenSubItem, key) => (
                                        <li key={key}>
                                          {childrenSubItem.type === "link" ? (
                                            <Link
                                              to={childrenSubItem.path + "/"}
                                              className={`${`sub-side-menu__item ${childrenSubItem.active ? "active" : " "}`
                                                }`}
                                              onClick={() =>
                                                toggleSidemenu(
                                                  childrenSubItem
                                                )
                                              }
                                            >
                                              {childrenSubItem.title}
                                            </Link>
                                          ) : (
                                            ""
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  ""
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
            <div className="slide-right" id="slide-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>

  );
}
