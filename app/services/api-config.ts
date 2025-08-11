// Configuración de la API
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.iso.edu.mx" // URL de producción
    : "http://localhost:3000"; // URL de desarrollo

// Configuración de timeouts
export const API_TIMEOUT = 30000; // 30 segundos

// Configuración de reintentos
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 segundo

// Headers por defecto
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Configuración de caché
export const CACHE_STALE_TIME = 5 * 60 * 1000; // 5 minutos
export const CACHE_GC_TIME = 10 * 60 * 1000; // 10 minutos
