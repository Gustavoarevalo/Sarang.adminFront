import { getToken, onMessage } from "firebase/messaging";
//prettier-ignore
import { getFirebaseMessaging, isFirebaseConfigured, registerMessagingServiceWorker, VAPID_KEY } from "../Authentication/firebase";

// Equivalente web de helpers/expoNotifications.ts de la app movil: el backend
// espera el mismo contrato (token + dispositivo + tipoToken + plataforma).
export type PushProvider = "fcm" | "apn";
export type PushTokenType = "fcm" | "expo";

export interface PushTokenInfo {
  token: string | null;
  dispositivo: PushProvider;
  tipoToken: PushTokenType;
  plataforma: string;
}

// En el navegador el token es de FCM directo (no pasa por el push service de
// Expo), por eso tipoToken es "fcm" y no "expo" como en la app.
export const PushTokenFallback: PushTokenInfo = {
  token: null,
  dispositivo: "fcm",
  tipoToken: "fcm",
  plataforma: "web",
};

// Pide permiso de notificaciones y devuelve el token de FCM del navegador.
// Nunca lanza: si algo falla se devuelve el fallback con token null para que el
// login siga funcionando igual que en la app.
export const getWebPushToken = async (): Promise<PushTokenInfo> => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return PushTokenFallback;
    }

    if (!isFirebaseConfigured()) {
      return PushTokenFallback;
    }

    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      return PushTokenFallback;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return PushTokenFallback;
    }

    const registration = await registerMessagingServiceWorker();

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration ?? undefined,
    });

    return { ...PushTokenFallback, token: token || null };
  } catch {
    return PushTokenFallback;
  }
};

// Notificaciones que llegan con la pestana abierta: FCM no las muestra solo,
// hay que dibujarlas a mano. Devuelve la funcion para cancelar la suscripcion.
export const onForegroundMessage = async (): Promise<() => void> => {
  try {
    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return () => undefined;
    }

    return onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? "Nueva notificación";
      const body = payload.notification?.body ?? "";

      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: `${import.meta.env.BASE_URL}images/logoceasinbg.png` });
      }
    });
  } catch {
    return () => undefined;
  }
};
