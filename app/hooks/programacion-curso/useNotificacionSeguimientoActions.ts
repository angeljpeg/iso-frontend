import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import {
  createNotificacion,
  updateNotificacion,
  deleteNotificacion,
  marcarNotificacionLeida,
} from "~/services/programacion-curso.service";
import type { CreateNotificacionDto, UpdateNotificacionDto } from "~/types/programacion-curso";

export function useNotificacionSeguimientoActions() {
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

  const createNotificacionSeguimiento = useCallback(
    async (notificacionData: CreateNotificacionDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createNotificacion({
          token: accessToken,
          ...notificacionData,
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

  const updateNotificacionSeguimiento = useCallback(
    async (id: string, notificacionData: UpdateNotificacionDto) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateNotificacion({
          token: accessToken,
          id,
          ...notificacionData,
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

  const deleteNotificacionSeguimiento = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        await deleteNotificacion({
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

  const marcarLeida = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await marcarNotificacionLeida({
          token: accessToken,
          id,
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
    createNotificacion: createNotificacionSeguimiento,
    updateNotificacion: updateNotificacionSeguimiento,
    deleteNotificacion: deleteNotificacionSeguimiento,
    marcarLeida,
  };
}
