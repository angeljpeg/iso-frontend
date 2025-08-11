import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getAllSeguimientosCurso } from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";
import type { GetSeguimientosCursoRequest } from "~/types/programacion-curso/servicios";

interface UseSeguimientosCursoOptions {
  page?: number;
  limit?: number;
  estado?: string;
  cuatrimestreId?: string;
  profesorId?: string;
  carrera?: string;
  search?: string;
  autoFetch?: boolean;
}

export function useSeguimientosCurso(
  initialOptions: UseSeguimientosCursoOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [seguimientos, setSeguimientos] = useState<SeguimientoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseSeguimientosCursoOptions>({
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
      options.page,
      options.limit,
      options.estado,
      options.cuatrimestreId,
      options.profesorId,
      options.carrera,
      options.search,
    ]
  );

  const fetchSeguimientos = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllSeguimientosCurso({
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
        err instanceof Error ? err.message : "Error al cargar seguimientos";
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
    (newOptions: Partial<UseSeguimientosCursoOptions>) => {
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
    if (options.autoFetch) {
      fetchSeguimientos();
    }
  }, [fetchSeguimientos, options.autoFetch]);

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
