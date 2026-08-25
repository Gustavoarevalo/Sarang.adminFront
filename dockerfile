# ============================================================
#  EcommerAdmin (Vite + React SPA) -> build estatico servido por nginx
#
#  IMPORTANTE: Vite "hornea" las variables VITE_* en el bundle durante
#  el build, NO se leen en runtime. Por eso viajan como ARG aqui y como
#  "build.args" en docker-compose.yml. Cambiar una variable obliga a
#  reconstruir la imagen (no basta reiniciar el contenedor).
#
#  Build local:
#    docker build -f dockerfile -t ecommeradmin:latest .
#  Con compose (recomendado):
#    docker compose up --build
# ============================================================

# ---------- Etapa 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Solo el manifiesto primero: mientras package*.json no cambie,
# Docker reutiliza la capa de npm ci y el build es mucho mas rapido.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# --- URL del backend ---------------------------------------------------
# Vacia (por defecto) = el bundle llama a rutas relativas "/api/..." y nginx
# hace de proxy hacia el gateway (ver BACKEND_ORIGIN en el compose). Es la
# opcion recomendada: mismo origen, sin CORS, y cambiar de backend no obliga
# a reconstruir el frontend.
# Si prefieres apuntar directo al gateway, pon aqui la URL publica
# (ej. https://api.midominio.com) y habilita CORS en el backend.
ARG VITE_BACK_URL=""
ENV VITE_BACK_URL=$VITE_BACK_URL

# --- Firebase Cloud Messaging -----------------------------------------
# Si faltan, isFirebaseConfigured() devuelve false y la app funciona igual,
# solo que sin notificaciones push (ver src/Authentication/firebase.ts).
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""
ARG VITE_FIREBASE_VAPID_KEY=""
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_VAPID_KEY=$VITE_FIREBASE_VAPID_KEY

# El proyecto arrastra muchas dependencias pesadas (exceljs, fabric, echarts,
# fullcalendar...); sin este margen el build se queda sin heap en servidores chicos.
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM nginx:1.27-alpine AS runner

# El entrypoint oficial de nginx procesa /etc/nginx/templates/*.template con
# envsubst y escribe el resultado en /etc/nginx/conf.d/. El filtro limita la
# sustitucion a BACKEND_* para no destrozar variables propias de nginx
# ($uri, $host, $request_uri...).
ENV BACKEND_ORIGIN=http://gateway:5087 \
    NGINX_ENVSUBST_FILTER=^BACKEND_

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx escucha en 85 (ver listen en nginx/default.conf.template),
# no en el 80 por defecto de la imagen.
EXPOSE 85

# El CMD por defecto de la imagen (nginx -g 'daemon off;') ya sirve.
