import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllGrupos } from "~/services/grupos";
import { useAuthStore } from "~/store/auth";
import type { Grupo } from "~/types/grupos";
import type { GetAllGruposResponse } from "~/types/grupos/services/get-all";

interface UseGruposOptions {
  search?: string;
  carrera?: string;
  cuatrimestre?: number;
  activo?: boolean;
  page?: number;
  limit?: number;
}

export function useGrupos(initialOptions: UseGruposOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseGruposOptions>({
    page: 1,
    limit: 10,
    activo: true, // Por defecto traer solo los activos
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
      options.search,
      options.carrera,
      options.cuatrimestre,
      options.activo,
      options.page,
      options.limit,
    ]
  );

  const fetchGrupos = useCallback(async () => {
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
        cuatrimestre: memoizedOptions.cuatrimestre?.toString(),
        activo: memoizedOptions.activo?.toString(),
        page: memoizedOptions.page?.toString(),
        limit: memoizedOptions.limit?.toString(),
      };

      const response: GetAllGruposResponse = await getAllGrupos(requestParams);

      setGrupos(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar grupos";
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
    fetchGrupos();
  }, [fetchGrupos]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseGruposOptions>) => {
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
      activo: true, // Mantener el filtro de activo por defecto
    });
  }, [options.limit]);

  return {
    grupos,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch: fetchGrupos,
  };
}