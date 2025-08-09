import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { CargaAcademica } from "../types/carga-academica";
import type { Grupo } from "~/types/grupos";
import { getOneGrupo, getCargaAcademicaByGrupo } from "../services/grupos";
import { useAuthStore } from "~/store/auth";

export function useGrupo(grupoId: string) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [cargasAcademicas, setCargasAcademicas] = useState<CargaAcademica[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        navigate("/login");
        return;
      }

      if (!grupoId) {
        setError("ID de grupo requerido");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [grupoData, cargasData] = await Promise.all([
          getOneGrupo({ token: accessToken, id: grupoId }),
          getCargaAcademicaByGrupo(grupoId, accessToken),
        ]);

        setGrupo(grupoData);
        setCargasAcademicas(cargasData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
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
    };

    fetchData();
  }, [grupoId, accessToken, navigate]);

  return {
    grupo,
    cargasAcademicas,
    isLoading,
    error,
  };
}
