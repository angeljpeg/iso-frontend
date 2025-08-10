import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getSeguimientosByProfesor } from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";

interface UseSeguimientosByProfesorOptions {
  profesorId?: string;
  cuatrimestreId?: string;
  estado?: string;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

export function useSeguimientosByProfesor(
  initialOptions: UseSeguimientosByProfesorOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [seguimientos, setSeguimientos] = useState<SeguimientoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseSeguimientosByProfesorOptions>({
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
      options.profesorId,
      options.cuatrimestreId,
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

    if (!memoizedOptions.profesorId) {
      setError("Se requiere ID del profesor");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getSeguimientosByProfesor({
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
        err instanceof Error
          ? err.message
          : "Error al cargar seguimientos del profesor";
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
    (newOptions: Partial<UseSeguimientosByProfesorOptions>) => {
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
    if (options.autoFetch && options.profesorId) {
      fetchSeguimientos();
    }
  }, [fetchSeguimientos, options.autoFetch, options.profesorId]);

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
