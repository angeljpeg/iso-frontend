import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { getReporteEstadia } from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type { GetReporteEstadiaResponse } from "~/types/estadias/services/get-reporte-estadia";

export function useEstadiaReporte() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al generar reporte";
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    },
    [navigate]
  );

  const generateReporte = useCallback(
    async (estadiaId: string): Promise<GetReporteEstadiaResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getReporteEstadia({
          estadiaId,
          token: accessToken,
        });

        return response;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, handleError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateReporte,
    isLoading,
    error,
    clearError,
  };
}