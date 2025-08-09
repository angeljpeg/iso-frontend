import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  createGrupo,
  updateGrupo,
  deactivateGrupo,
  reactivateGrupo,
  deleteGrupo,
} from "~/services/grupos";
import { useAuthStore } from "~/store/auth";
import type {
  CreateGrupoRequest,
  CreateGrupoResponse,
  UpdateGrupoRequest,
  UpdateGrupoResponse,
  DeactivateGrupoResponse,
  ReactivateGrupoResponse,
} from "~/types/grupos";

export function useGrupoActions() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }

      throw err;
    },
    [navigate]
  );

  const create = useCallback(
    async (
      grupoData: Omit<CreateGrupoRequest, "token">
    ): Promise<CreateGrupoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await createGrupo({
          ...grupoData,
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
      grupoData: Omit<UpdateGrupoRequest, "token" | "id">
    ): Promise<UpdateGrupoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await updateGrupo({
          ...grupoData,
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

  const deactivate = useCallback(
    async (id: string): Promise<DeactivateGrupoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await deactivateGrupo({
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

  const reactivate = useCallback(
    async (id: string): Promise<ReactivateGrupoResponse> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await reactivateGrupo({
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
    async (id: string): Promise<void> => {
      if (!accessToken) {
        const error = new Error("No hay token de autenticación");
        handleError(error);
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);

        await deleteGrupo({
          id,
          token: accessToken,
        });
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
    deactivate,
    reactivate,
    remove,
    isLoading,
    error,
    clearError,
  };
}