import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import {
  createSeguimientoDetalle,
  updateSeguimientoDetalle,
  deleteSeguimientoDetalle,
} from "~/services/programacion-curso.service";
import type { CreateSeguimientoDetalleDto, UpdateSeguimientoDetalleDto } from "~/types/programacion-curso";

export function useSeguimientoDetalleActions() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error en la operación";
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createDetalle = useCallback(
    async (detalleData: CreateSeguimientoDetalleDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createSeguimientoDetalle({
          token: accessToken,
          ...detalleData,
        });

        return response.data;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, navigate, handleError]
  );

  const updateDetalle = useCallback(
    async (id: string, detalleData: UpdateSeguimientoDetalleDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateSeguimientoDetalle({
          token: accessToken,
          id,
          ...detalleData,
        });

        return response.data;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, navigate, handleError]
  );

  const deleteDetalle = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        await deleteSeguimientoDetalle({
          token: accessToken,
          id,
        });

        return true;
      } catch (err) {
        handleError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, navigate, handleError]
  );

  return {
    isLoading,
    error,
    clearError,
    createDetalle,
    updateDetalle,
    deleteDetalle,
  };
}
