import { useState, useEffect } from "react";
import type { Grupo, CargaAcademica } from "../types/carga-academica";
import { gruposService } from "../services/grupos";

export function useGrupo(grupoId: string) {
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [cargasAcademicas, setCargasAcademicas] = useState<CargaAcademica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [grupoData, cargasData] = await Promise.all([
          gruposService.getGrupoById(grupoId),
          gruposService.getCargaAcademicaByGrupo(grupoId),
        ]);

        setGrupo(grupoData);
        setCargasAcademicas(cargasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    if (grupoId) {
      fetchData();
    }
  }, [grupoId]);

  return {
    grupo,
    cargasAcademicas,
    isLoading,
    error,
  };
}