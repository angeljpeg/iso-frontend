import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  createEstadia,
  updateEstadia,
  deleteEstadia,
} from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type {
  CreateEstadiaRequest,
  CreateEstadiaResponse,
  UpdateEstadiaRequest,
  UpdateEstadiaResponse,
  DeleteEstadiaResponse,
} from "~/types/estadias/services";

export function useEstadiaActions() {
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
    async (estadiaData: Omit<CreateEstadiaRequest, "token">): Promise<CreateEstadiaResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createEstadia({
          ...estadiaData,
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
      estadiaData: Omit<UpdateEstadiaRequest, "id" | "token">
    ): Promise<UpdateEstadiaResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateEstadia({
          ...estadiaData,
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
    async (id: string): Promise<DeleteEstadiaResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await deleteEstadia({
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