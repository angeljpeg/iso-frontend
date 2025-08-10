import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import {
  createSeguimientoCurso,
  updateSeguimientoCurso,
  deleteSeguimientoCurso,
  updateSeguimientoEstado,
} from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";
import type { CreateSeguimientoCursoDto, UpdateSeguimientoCursoDto } from "~/types/programacion-curso";
import type { EstadoSeguimiento } from "~/types/programacion-curso";

export function useSeguimientoCursoActions() {
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

  const createSeguimiento = useCallback(
    async (seguimientoData: CreateSeguimientoCursoDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createSeguimientoCurso({
          token: accessToken,
          ...seguimientoData,
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

  const updateSeguimiento = useCallback(
    async (id: string, seguimientoData: UpdateSeguimientoCursoDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateSeguimientoCurso({
          token: accessToken,
          id,
          ...seguimientoData,
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

  const deleteSeguimiento = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        await deleteSeguimientoCurso({
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

  const updateEstado = useCallback(
    async (id: string, estado: EstadoSeguimiento) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateSeguimientoEstado({
          token: accessToken,
          id,
          estado,
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

  return {
    isLoading,
    error,
    clearError,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    updateEstado,
  };
}
