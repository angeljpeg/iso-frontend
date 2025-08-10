import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import type { Asignatura } from "~/types/asignaturas";

// Hook para acciones futuras de asignaturas
// Por ahora solo tiene la estructura base para cuando se implementen operaciones CRUD
export function useAsignaturaActions() {
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

  // Función placeholder para crear asignatura (cuando se implemente en el backend)
  const createAsignatura = useCallback(
    async (asignaturaData: Partial<Asignatura>) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implementar cuando se agregue el endpoint en el backend
        // const response = await createAsignaturaService({
        //   token: accessToken,
        //   ...asignaturaData
        // });

        throw new Error("Función no implementada aún en el backend");
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, navigate, handleError]
  );

  // Función placeholder para actualizar asignatura (cuando se implemente en el backend)
  const updateAsignatura = useCallback(
    async (nombre: string, asignaturaData: Partial<Asignatura>) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implementar cuando se agregue el endpoint en el backend
        // const response = await updateAsignaturaService({
        //   token: accessToken,
        //   nombre,
        //   ...asignaturaData
        // });

        throw new Error("Función no implementada aún en el backend");
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, navigate, handleError]
  );

  // Función placeholder para eliminar asignatura (cuando se implemente en el backend)
  const deleteAsignatura = useCallback(
    async (nombre: string) => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implementar cuando se agregue el endpoint en el backend
        // const response = await deleteAsignaturaService({
        //   token: accessToken,
        //   nombre
        // });

        throw new Error("Función no implementada aún en el backend");
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
    // Estado
    isLoading,
    error,

    // Acciones
    createAsignatura,
    updateAsignatura,
    deleteAsignatura,
    clearError,
  };
}
