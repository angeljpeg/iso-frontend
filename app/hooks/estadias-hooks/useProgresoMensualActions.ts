import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  createProgreso,
  updateProgreso,
  deleteProgreso,
} from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type {
  CreateProgresoRequest,
  CreateProgresoResponse,
  UpdateProgresoRequest,
  UpdateProgresoResponse,
  DeleteProgresoResponse,
} from "~/types/estadias/services";

export function useProgresoMensualActions() {
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
    async (progresoData: Omit<CreateProgresoRequest, "token">): Promise<CreateProgresoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createProgreso({
          ...progresoData,
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
      progresoData: Omit<UpdateProgresoRequest, "id" | "token">
    ): Promise<UpdateProgresoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateProgreso({
          ...progresoData,
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
    async (id: string): Promise<DeleteProgresoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await deleteProgreso({
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