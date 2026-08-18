import { Outlet } from "react-router-dom";
import { useWebPushNotifications } from "../Hooks/useWebPushNotifications";

const SignAuth = () => {
  // Al entrar al login se pide el permiso de notificaciones y se obtiene el
  // token de FCM del navegador; SignIn lo envia junto con las credenciales.
  useWebPushNotifications();

  return (
    <Outlet />
  );
};

export default SignAuth;
