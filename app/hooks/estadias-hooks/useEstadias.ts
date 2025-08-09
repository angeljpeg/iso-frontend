import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllEstadias, getEstadiasByProfesor } from "~/services/estadias";
import { useAuthStore } from "~/store/auth";
import type { Estadia } from "~/types/estadias";

interface UseEstadiasOptions {
  profesorId?: string;
  periodo?: string;
  onlyMyEstadias?: boolean;
}

export function useEstadias(options: UseEstadiasOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [estadias, setEstadias] = useState<Estadia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profesorId, periodo, onlyMyEstadias = false } = options;

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar estadías";
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

  const fetchEstadias = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let estadiasData: Estadia[];

      if (onlyMyEstadias) {
        const response = await getEstadiasByProfesor({
          token: accessToken,
        });
        estadiasData = response.data;
      } else {
        const response = await getAllEstadias({
          token: accessToken,
        });
        estadiasData = response.data;
      }

      setEstadias(estadiasData);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, onlyMyEstadias, navigate, handleError]);

  useEffect(() => {
    fetchEstadias();
  }, [fetchEstadias]);

  const filteredEstadias = useMemo(() => {
    return estadias.filter((estadia) => {
      if (profesorId && estadia.profesor?.id !== profesorId) return false;
      if (periodo && estadia.periodo !== periodo) return false;
      return true;
    });
  }, [estadias, profesorId, periodo]);

  return {
    estadias: filteredEstadias,
    allEstadias: estadias,
    isLoading,
    error,
    refetch: fetchEstadias,
  };
}
