import { useEffect } from "react";
import { getWebPushToken, onForegroundMessage } from "../helper/webPushNotifications";
import { PushTokenStore } from "../store/PushTokenStore";

// Pide el permiso de notificaciones del navegador, guarda el token de FCM en el
// store y deja escuchando los mensajes que llegan con la pestana abierta.
export const useWebPushNotifications = () => {
  const { PushToken, SetPushToken } = PushTokenStore();

  useEffect(() => {
    let activo = true;

    const renderGetToken = async () => {
      const info = await getWebPushToken();

      if (activo) {
        SetPushToken(info);
      }
    };

    renderGetToken();

    return () => {
      activo = false;
    };
  }, [SetPushToken]);

  useEffect(() => {
    let desuscribir: () => void = () => undefined;
    let activo = true;

    onForegroundMessage().then((unsubscribe) => {
      if (activo) {
        desuscribir = unsubscribe;
      } else {
        unsubscribe();
      }
    });

    return () => {
      activo = false;
      desuscribir();
    };
  }, []);

  return PushToken;
};
