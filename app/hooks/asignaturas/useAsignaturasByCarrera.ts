import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAsignaturasByCarrera } from "~/services/asignaturas.service";
import { useAuthStore } from "~/store/auth";
import type { Asignatura } from "~/types/asignaturas";

export function useAsignaturasByCarrera(codigoCarrera: string) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignaturasByCarrera = useCallback(async () => {
    if (!codigoCarrera || !accessToken) {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAsignaturasByCarrera({
        token: accessToken,
        codigoCarrera,
      });

      setAsignaturas(response.asignaturas);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar las asignaturas de la carrera";
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
  }, [codigoCarrera, accessToken, navigate]);

  useEffect(() => {
    fetchAsignaturasByCarrera();
  }, [fetchAsignaturasByCarrera]);

  return {
    asignaturas,
    isLoading,
    error,
    refetch: fetchAsignaturasByCarrera,
  };
}
