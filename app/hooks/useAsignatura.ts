import { useState, useEffect } from "react";
import type { Asignatura, CargaAcademica } from "../types/carga-academica";
import { cargaAcademicaService } from "../services/carga-academica.service";

export function useAsignatura(asignaturaId: string) {
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [cargaAcademica, setCargaAcademica] = useState<CargaAcademica | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener la asignatura
        const asignaturaData = await cargaAcademicaService.getAsignaturaById(
          asignaturaId
        );
        setAsignatura(asignaturaData);

        // Obtener la carga académica actual del usuario
        const cargasAcademicas = await cargaAcademicaService.getMiCargaActual();

        // Buscar la carga académica que corresponde a esta asignatura
        const cargaRelacionada = cargasAcademicas.find(
          (carga) => carga.asignatura === asignaturaId
        );

        setCargaAcademica(cargaRelacionada || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    if (asignaturaId) {
      fetchData();
    }
  }, [asignaturaId]);

  return {
    asignatura,
    cargaAcademica,
    isLoading,
    error,
  };
}
