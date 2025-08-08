import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { getAllUsuarios } from "~/services/coordinadores/usuarios.service";
import { useAuthStore } from "~/store/auth";
import type { Usuario, RolUsuarioType } from "~/types/usuarios";
import type { GetAllUsuariosResponse } from "~/types/usuarios/services/get-all";

interface UseUsuariosOptions {
  rol?: RolUsuarioType;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export function useUsuarios(initialOptions: UseUsuariosOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseUsuariosOptions>({
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
    [options.rol, options.activo, options.search, options.page, options.limit]
  );

  const fetchUsuarios = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response: GetAllUsuariosResponse = await getAllUsuarios({
        token: accessToken,
        ...memoizedOptions,
      });

      setUsuarios(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar usuarios";
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
    fetchUsuarios();
  }, [fetchUsuarios]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseUsuariosOptions>) => {
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
    usuarios,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch: fetchUsuarios,
  };
}
