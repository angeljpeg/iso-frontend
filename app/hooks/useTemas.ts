import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { cargaAcademicaService } from "../services/carga-academica.service";
import type { Tema } from "../types/carga-academica";

export function useTemas(asignaturaId: string) {
  const navigate = useNavigate();
  const [temas, setTemas] = useState<Tema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemas = async () => {
    if (!asignaturaId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await cargaAcademicaService.getTemasByAsignatura(
        asignaturaId
      );
      setTemas(data?.temas || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los temas";
      setError(errorMessage);

      // Si es un error de sesión expirada, redirigir al login
      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, [asignaturaId]);

  return {
    temas,
    isLoading,
    error,
    refetch: fetchTemas,
  };
}
