import { useState } from "react";
import { useNavigate } from "react-router";
import { getAuthHeaders, handleAuthError } from "~/utils/auth";
import type { CreateSeguimientoCursoDto } from "~/types/seguimientos";

export function useSeguimientos() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearSeguimiento = async (data: CreateSeguimientoCursoDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/seguimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError(navigate);
          return null;
        }
        throw new Error("Error al crear el seguimiento");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    crearSeguimiento,
    isLoading,
    error,
    clearError,
  };
}
