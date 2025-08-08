import { useAuthStore } from "../store/auth";

export function isTokenValid(): boolean {
  const token = useAuthStore.getState().accessToken;
  return !!token;
}

export function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;

  if (!token) {
    throw new Error("No hay token de autenticación disponible");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Updated function to handle navigation
export function handleAuthError(navigate: (path: string) => void): void {
  // Token inválido o expirado
  useAuthStore.getState().logout();
  navigate("/login");
}

// Keep the old function for backward compatibility with services
export function handleAuthErrorWithStatus(status: number): void {
  if (status === 401) {
    // Token inválido o expirado
    useAuthStore.getState().logout();
    throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
  }
}
