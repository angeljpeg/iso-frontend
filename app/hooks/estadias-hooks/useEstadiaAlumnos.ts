import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllAlumnos, getAlumnosByEstadia } from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type { EstadiaAlumno } from "~/types/estadias";

interface UseEstadiaAlumnosOptions {
  estadiaId?: string;
}

export function useEstadiaAlumnos(options: UseEstadiaAlumnosOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [alumnos, setAlumnos] = useState<EstadiaAlumno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { estadiaId } = options;

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar alumnos";
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

  const fetchAlumnos = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let alumnosData: EstadiaAlumno[];

      if (estadiaId) {
        const response = await getAlumnosByEstadia({
          estadiaId,
          token: accessToken,
        });
        alumnosData = response.data;
      } else {
        const response = await getAllAlumnos({
          token: accessToken,
        });
        alumnosData = response.data;
      }

      setAlumnos(alumnosData);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, estadiaId, navigate, handleError]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  return {
    alumnos,
    isLoading,
    error,
    refetch: fetchAlumnos,
  };
}
