import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  searchAsignaturas,
  getAsignaturasPaginated,
} from "~/services/asignaturas.service";
import { useAuthStore } from "~/store/auth";
import type { Asignatura } from "~/types/asignaturas";

interface UseAsignaturasSearchOptions {
  initialSearch?: string;
  initialCarrera?: string;
  initialPage?: number;
  initialLimit?: number;
}

export function useAsignaturasSearch(
  initialOptions: UseAsignaturasSearchOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(
    initialOptions.initialSearch || ""
  );
  const [carrera, setCarrera] = useState(initialOptions.initialCarrera || "");
  const [page, setPage] = useState(initialOptions.initialPage || 1);
  const [limit, setLimit] = useState(initialOptions.initialLimit || 10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const search = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await searchAsignaturas(
        searchTerm,
        accessToken,
        carrera || undefined,
        page,
        limit
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
        err instanceof Error ? err.message : "Error al buscar asignaturas";
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
  }, [searchTerm, carrera, page, limit, accessToken, navigate]);

  const getPaginated = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAsignaturasPaginated(
        page,
        limit,
        accessToken,
        searchTerm || undefined,
        carrera || undefined
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
        err instanceof Error
          ? err.message
          : "Error al cargar asignaturas paginadas";
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
  }, [page, limit, searchTerm, carrera, accessToken, navigate]);

  const updateSearchTerm = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setPage(1); // Reset a página 1 cuando cambia la búsqueda
  }, []);

  const updateCarrera = useCallback((newCarrera: string) => {
    setCarrera(newCarrera);
    setPage(1); // Reset a página 1 cuando cambia la carrera
  }, []);

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset a página 1 cuando cambia el límite
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCarrera("");
    setPage(1);
    setLimit(initialOptions.initialLimit || 10);
  }, [initialOptions.initialLimit]);

  return {
    // Estado
    asignaturas,
    isLoading,
    error,
    pagination,

    // Filtros
    searchTerm,
    carrera,
    page,
    limit,

    // Acciones
    search,
    getPaginated,
    updateSearchTerm,
    updateCarrera,
    updatePage,
    updateLimit,
    clearFilters,
  };
}
