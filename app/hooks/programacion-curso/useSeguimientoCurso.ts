import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getSeguimientoCursoById } from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";

interface UseSeguimientoCursoOptions {
  autoFetch?: boolean;
}

export function useSeguimientoCurso(
  seguimientoId: string | null,
  options: UseSeguimientoCursoOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [seguimiento, setSeguimiento] = useState<SeguimientoCurso | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoFetch = true } = options;

  const fetchSeguimiento = useCallback(async () => {
    if (!seguimientoId || !accessToken) {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getSeguimientoCursoById({
        token: accessToken,
        id: seguimientoId,
      });

      setSeguimiento(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar seguimiento";
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
  }, [seguimientoId, accessToken, navigate]);

  const refresh = useCallback(() => {
    fetchSeguimiento();
  }, [fetchSeguimiento]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch cuando cambie el ID o el token
  useEffect(() => {
    if (autoFetch && seguimientoId && accessToken) {
      fetchSeguimiento();
    }
  }, [fetchSeguimiento, autoFetch, seguimientoId, accessToken]);

  return {
    seguimiento,
    isLoading,
    error,
    refresh,
    clearError,
    fetchSeguimiento,
  };
}
