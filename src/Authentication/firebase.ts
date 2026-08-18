import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

// Configuracion del proyecto de Firebase (la misma cuenta que usa la app movil,
// pero con la app WEB registrada en la consola). Se lee del .env para no
// hornear credenciales en el bundle.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

// Clave publica de Web Push (Firebase > Cloud Messaging > Certificados web push).
export const VAPID_KEY: string = import.meta.env.VITE_FIREBASE_VAPID_KEY ?? "";

// Sin estas cuatro claves el SDK no puede pedir el token, asi que se evita
// inicializarlo y el login simplemente viaja sin token de notificaciones.
export const isFirebaseConfigured = (): boolean =>
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.messagingSenderId
  );

let app: FirebaseApp | null = null;

const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!app) {
    app = initializeApp(firebaseConfig);
  }

  return app;
};

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  const application = getFirebaseApp();

  if (!application) {
    return null;
  }

  // Safari viejo / navegadores sin push devuelven false y no hay que continuar.
  if (!(await isSupported())) {
    return null;
  }

  return getMessaging(application);
};

// El service worker vive en /public, por lo que no ve las variables de Vite:
// la configuracion se le pasa por query string al registrarlo.
export const registerMessagingServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator) || !isFirebaseConfigured()) {
      return null;
    }

    try {
      const params = new URLSearchParams(firebaseConfig).toString();
      return await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}firebase-messaging-sw.js?${params}`,
        { scope: import.meta.env.BASE_URL }
      );
    } catch {
      return null;
    }
  };
