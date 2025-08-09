import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllCuatrimestres } from "~/services/cuatrimestres";
import { useAuthStore } from "~/store/auth";
import type {
  Cuatrimestre,
  CuatrimestreEstadoType,
} from "~/types/cuatrimestres";
import type { GetAllCuatrimestresResponse } from "~/types/cuatrimestres/services/get-all";

interface UseCuatrimestresOptions {
  año?: number;
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  actual?: boolean;
  page?: number;
  limit?: number;
}

export function useCuatrimestres(initialOptions: UseCuatrimestresOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [cuatrimestres, setCuatrimestres] = useState<
    (Cuatrimestre & { estado: CuatrimestreEstadoType })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseCuatrimestresOptions>({
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
    [
      options.año,
      options.fechaInicio,
      options.fechaFin,
      options.actual,
      options.page,
      options.limit,
    ]
  );

  const fetchCuatrimestres = useCallback(async () => {
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
        año: memoizedOptions.año?.toString(),
        fechaInicio: memoizedOptions.fechaInicio,
        fechaFin: memoizedOptions.fechaFin,
        actual: memoizedOptions.actual?.toString(),
        page: memoizedOptions.page?.toString(),
        limit: memoizedOptions.limit?.toString(),
      };

      const response: GetAllCuatrimestresResponse = await getAllCuatrimestres(
        requestParams
      );

      setCuatrimestres(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar cuatrimestres";
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
    fetchCuatrimestres();
  }, [fetchCuatrimestres]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseCuatrimestresOptions>) => {
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
    cuatrimestres,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch: fetchCuatrimestres,
  };
}
