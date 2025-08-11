import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { generarReporteDashboard } from "~/services/reportes-seguimiento.service";
import type { ReporteDashboard } from "~/types/programacion-curso";

export function useReporteDashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [reporte, setReporte] = useState<ReporteDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReporte = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await generarReporteDashboard(accessToken);
      setReporte(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar reporte de dashboard";
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, navigate]);

  const refresh = useCallback(() => {
    fetchReporte();
  }, [fetchReporte]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch al montar el componente
  useEffect(() => {
    fetchReporte();
  }, [fetchReporte]);

  return {
    reporte,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    fetchReporte,
  };
}
