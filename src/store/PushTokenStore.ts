import { create } from "zustand";
import { PushTokenFallback, PushTokenInfo } from "../helper/webPushNotifications";

// El token de FCM se pide al abrir la pantalla de login (SignAuth) y se guarda
// aqui para que SignIn lo mande junto con las credenciales, igual que hace la
// app movil en app/index.tsx.
interface IPushTokenStore {
  PushToken: PushTokenInfo;
  SetPushToken: (value: PushTokenInfo) => void;
}

export const PushTokenStore = create<IPushTokenStore>((set) => ({
  PushToken: PushTokenFallback,
  SetPushToken: (value: PushTokenInfo) => set({ PushToken: value }),
}));
