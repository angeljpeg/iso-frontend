import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { cargaAcademicaService } from "../services/carga-academica";
import type { CargaAcademica } from "../types/carga-academica";

export function useCargaAcademica() {
  const navigate = useNavigate();
  const [cargasAcademicas, setCargasAcademicas] = useState<CargaAcademica[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCargaAcademica = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await cargaAcademicaService.getMiCargaActual();
      
      // Agrupar por grupo para evitar duplicados
      const gruposUnicos = new Map<string, CargaAcademica>();
      
      data.forEach((cargaAcademica) => {
        const grupoId = cargaAcademica.grupo.id;
        if (!gruposUnicos.has(grupoId)) {
          gruposUnicos.set(grupoId, cargaAcademica);
        }
      });
      
      // Convertir el Map a array
      const cargasUnicas = Array.from(gruposUnicos.values());
      setCargasAcademicas(cargasUnicas);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los datos";
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
    fetchCargaAcademica();
  }, []);

  return {
    cargasAcademicas,
    isLoading,
    error,
    refetch: fetchCargaAcademica,
  };
}
