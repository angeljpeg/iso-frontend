import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  createAlumno,
  updateAlumno,
  deleteAlumno,
} from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type {
  CreateAlumnoRequest,
  CreateAlumnoResponse,
  UpdateAlumnoRequest,
  UpdateAlumnoResponse,
  DeleteAlumnoResponse,
} from "~/types/estadias/services";

export function useEstadiaAlumnoActions() {
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

  const create = useCallback(
    async (alumnoData: Omit<CreateAlumnoRequest, "token">): Promise<CreateAlumnoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createAlumno({
          ...alumnoData,
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

  const update = useCallback(
    async (
      id: string,
      alumnoData: Omit<UpdateAlumnoRequest, "id" | "token">
    ): Promise<UpdateAlumnoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateAlumno({
          ...alumnoData,
          id,
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

  const remove = useCallback(
    async (id: string): Promise<DeleteAlumnoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await deleteAlumno({
          id,
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
    create,
    update,
    remove,
    isLoading,
    error,
    clearError,
  };
}