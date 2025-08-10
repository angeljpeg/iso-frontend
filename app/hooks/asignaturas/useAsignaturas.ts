import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllAsignaturas } from "~/services/asignaturas.service";
import { useAuthStore } from "~/store/auth";
import type { Asignatura } from "~/types/asignaturas";
import type { GetAllAsignaturasResponse } from "~/types/asignaturas/services/get-all";

interface UseAsignaturasOptions {
  search?: string;
  carrera?: string;
  page?: number;
  limit?: number;
}

export function useAsignaturas(initialOptions: UseAsignaturasOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseAsignaturasOptions>({
    page: 1,
    limit: 10,
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
    [options.search, options.carrera, options.page, options.limit]
  );

  const fetchAsignaturas = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        token: accessToken,
        search: memoizedOptions.search,
        carrera: memoizedOptions.carrera,
        page: memoizedOptions.page,
        limit: memoizedOptions.limit,
      };

      const response: GetAllAsignaturasResponse = await getAllAsignaturas(
        requestParams
      );

      setAsignaturas(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar asignaturas";
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
  }, [accessToken, memoizedOptions, navigate]);

  useEffect(() => {
    fetchAsignaturas();
  }, [fetchAsignaturas]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseAsignaturasOptions>) => {
      setOptions((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page !== undefined ? newFilters.page : 1, // Reset a página 1 cuando cambian filtros
      }));
    },
    []
  );

  const updatePage = useCallback((page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  }, []);

  const clearFilters = useCallback(() => {
    setOptions({
      page: 1,
      limit: options.limit,
    });
  }, [options.limit]);

  return {
    asignaturas,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch: fetchAsignaturas,
  };
}
