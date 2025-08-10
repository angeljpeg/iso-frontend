import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getSeguimientosByCargaAcademica } from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";

interface UseSeguimientosByCargaAcademicaOptions {
  cargaAcademicaId?: string;
  estado?: string;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export function useSeguimientosByCargaAcademica(
  initialOptions: UseSeguimientosByCargaAcademicaOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [seguimientos, setSeguimientos] = useState<SeguimientoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseSeguimientosByCargaAcademicaOptions>({
    page: 1,
    limit: 10,
    autoFetch: true,
    ...initialOptions,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Memoizar las options para evitar re-renders innecesarios
  const memoizedOptions = useMemo(
    () => options,
    [
      options.cargaAcademicaId,
      options.estado,
      options.page,
      options.limit,
    ]
  );

  const fetchSeguimientos = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    if (!memoizedOptions.cargaAcademicaId) {
      setError("Se requiere ID de la carga académica");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getSeguimientosByCargaAcademica({
        token: accessToken,
        ...memoizedOptions,
      });

      setSeguimientos(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar seguimientos de la carga académica";
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
  }, [accessToken, navigate, memoizedOptions]);

  const updateOptions = useCallback(
    (newOptions: Partial<UseSeguimientosByCargaAcademicaOptions>) => {
      setOptions((prev) => ({
        ...prev,
        ...newOptions,
        page: newOptions.page !== undefined ? newOptions.page : 1, // Reset page when filters change
      }));
    },
    []
  );

  const refresh = useCallback(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch cuando cambien las options
  useEffect(() => {
    if (options.autoFetch && options.cargaAcademicaId) {
      fetchSeguimientos();
    }
  }, [fetchSeguimientos, options.autoFetch, options.cargaAcademicaId]);

  return {
    seguimientos,
    isLoading,
    error,
    pagination,
    options,
    updateOptions,
    refresh,
    clearError,
    fetchSeguimientos,
  };
}
