import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getProgresoByAlumno } from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type { ProgresoMensual } from "~/types/estadias";
import type { GetProgresoByAlumnoResponse } from "~/types/estadias/services/get-progreso-by-alumno";

interface UseProgresoMensualOptions {
  estadiaAlumnoId?: string;
  page?: number;
  limit?: number;
}

export function useProgresoMensual(options: UseProgresoMensualOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [progresos, setProgresos] = useState<ProgresoMensual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const { estadiaAlumnoId, page = 1, limit = 10 } = options;

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar progresos";
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

  const fetchProgresos = useCallback(async () => {
    if (!accessToken || !estadiaAlumnoId) {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response: GetProgresoByAlumnoResponse = await getProgresoByAlumno({
        estadiaAlumnoId,
        token: accessToken,
        page,
        limit,
      });

      setProgresos(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, estadiaAlumnoId, page, limit, navigate, handleError]);

  useEffect(() => {
    fetchProgresos();
  }, [fetchProgresos]);

  return {
    progresos,
    isLoading,
    error,
    pagination,
    refetch: fetchProgresos,
  };
}
