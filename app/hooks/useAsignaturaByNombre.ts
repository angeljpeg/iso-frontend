import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { asignaturasService } from "../services/asignaturas";
import type { Asignatura } from "../types/carga-academica";

export function useAsignaturaByNombre(nombre: string | undefined) {
  const navigate = useNavigate();
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignatura = async () => {
    if (!nombre) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await asignaturasService.getAsignaturaByNombre(nombre);
      setAsignatura(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar la asignatura";
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
    fetchAsignatura();
  }, [nombre]);

  return {
    asignatura,
    isLoading,
    error,
    refetch: fetchAsignatura,
  };
}