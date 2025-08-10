import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getSeguimientoDetalles } from "~/services/programacion-curso.service";
import type { SeguimientoDetalle } from "~/types/programacion-curso";

interface UseSeguimientoDetallesOptions {
  autoFetch?: boolean;
}

export function useSeguimientoDetalles(
  seguimientoCursoId: string | null,
  options: UseSeguimientoDetallesOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [detalles, setDetalles] = useState<SeguimientoDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoFetch = true } = options;

  const fetchDetalles = useCallback(async () => {
    if (!seguimientoCursoId || !accessToken) {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getSeguimientoDetalles({
        token: accessToken,
        seguimientoCursoId,
      });

      setDetalles(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar detalles";
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
  }, [seguimientoCursoId, accessToken, navigate]);

  const refresh = useCallback(() => {
    fetchDetalles();
  }, [fetchDetalles]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch cuando cambie el ID o el token
  useEffect(() => {
    if (autoFetch && seguimientoCursoId && accessToken) {
      fetchDetalles();
    }
  }, [fetchDetalles, autoFetch, seguimientoCursoId, accessToken]);

  return {
    detalles,
    isLoading,
    error,
    refresh,
    clearError,
    fetchDetalles,
  };
}
