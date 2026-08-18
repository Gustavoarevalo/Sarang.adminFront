/* global importScripts, firebase */
// Service worker de Firebase Cloud Messaging: recibe las notificaciones cuando
// la pestana esta cerrada o en segundo plano.
//
// Este archivo es estatico (vive en /public), por lo que NO ve las variables de
// Vite: la configuracion llega por query string desde
// registerMessagingServiceWorker() en src/Authentication/firebase.ts.

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const params = new URL(self.location).searchParams;

const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = (payload.notification && payload.notification.title) || 'Nueva notificación';
    const body = (payload.notification && payload.notification.body) || '';

    self.registration.showNotification(title, {
      body: body,
      icon: '/images/logoceasinbg.png',
      data: payload.data || {},
    });
  });
}

// Al tocar la notificacion se enfoca la pestana del panel si ya esta abierta.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }

      return undefined;
    })
  );
});
