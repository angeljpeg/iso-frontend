import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAlumno } from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type { EstadiaAlumno } from "~/types/estadias";
import type { GetAlumnoResponse } from "~/types/estadias/services";

interface UseEstadiaAlumnoOptions {
  estadiaAlumnoId: string;
}

export function useEstadiaAlumno(options: UseEstadiaAlumnoOptions) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [alumno, setAlumno] = useState<EstadiaAlumno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { estadiaAlumnoId } = options;

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar alumno";
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

  const fetchAlumno = useCallback(async () => {
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

      const response: GetAlumnoResponse = await getAlumno({
        id: estadiaAlumnoId,
        token: accessToken,
      });

      setAlumno(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, estadiaAlumnoId, navigate, handleError]);

  useEffect(() => {
    fetchAlumno();
  }, [fetchAlumno]);

  return {
    alumno,
    isLoading,
    error,
    refetch: fetchAlumno,
  };
}
