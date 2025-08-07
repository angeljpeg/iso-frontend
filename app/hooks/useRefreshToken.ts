import { useEffect } from "react";
import { authService } from "../services/auth";
import { useAuthStore } from "../store/auth";

export const useRefreshToken = () => {
  const { refreshToken, login, logout } = useAuthStore();

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!refreshToken) {
        logout();
        return;
      }

      try {
        const response = await authService.refreshToken(refreshToken);
        login(response);
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
      }
    };

    // Verificar el token cada 5 minutos
    const interval = setInterval(refreshAccessToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, login, logout]);

  return null;
};
