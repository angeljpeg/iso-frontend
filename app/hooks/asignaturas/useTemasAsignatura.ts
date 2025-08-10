import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getTemasAsignatura } from "~/services/asignaturas.service";
import { useAuthStore } from "~/store/auth";
import type { Tema } from "~/types/temas";

export function useTemasAsignatura(nombre: string) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [temas, setTemas] = useState<Tema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemas = useCallback(async () => {
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

      const response = await getTemasAsignatura({
        token: accessToken,
        nombre,
      });

      setTemas(response.temas);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los temas de la asignatura";
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
    fetchTemas();
  }, [fetchTemas]);

  return {
    temas,
    isLoading,
    error,
    refetch: fetchTemas,
  };
}
