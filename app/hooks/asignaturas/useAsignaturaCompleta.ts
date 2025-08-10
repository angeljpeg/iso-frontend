import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAsignaturaCompleta } from "~/services/asignaturas.service";
import { useAuthStore } from "~/store/auth";
import type { Asignatura } from "~/types/asignaturas";

export function useAsignaturaCompleta(nombre: string) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignaturaCompleta = useCallback(async () => {
    if (!nombre || !accessToken) {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAsignaturaCompleta({
        token: accessToken,
        nombre,
      });

      setAsignatura(response.asignatura);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar la asignatura completa";
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
  }, [nombre, accessToken, navigate]);

  useEffect(() => {
    fetchAsignaturaCompleta();
  }, [fetchAsignaturaCompleta]);

  return {
    asignatura,
    isLoading,
    error,
    refetch: fetchAsignaturaCompleta,
  };
}
