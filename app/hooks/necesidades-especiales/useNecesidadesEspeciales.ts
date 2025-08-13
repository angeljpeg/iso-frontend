import { useState, useEffect, useCallback } from "react";
import {
  getAllNecesidadesEspeciales,
  getNecesidadesEspecialesByCargaAcademica,
  getNecesidadesEspecialesById,
} from "../../services/necesidades-especiales.service";
import {
  type NecesidadesEspeciales,
  type NecesidadesEspecialesPaginatedResponse,
  type QueryNecesidadesEspecialesDto,
} from "../../types/necesidades-especiales";

interface UseNecesidadesEspecialesReturn {
  necesidades: NecesidadesEspeciales[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: Partial<QueryNecesidadesEspecialesDto>) => void;
  filters: QueryNecesidadesEspecialesDto;
}

export const useNecesidadesEspeciales = (
  initialFilters: Partial<QueryNecesidadesEspecialesDto> = {}
): UseNecesidadesEspecialesReturn => {
  const [necesidades, setNecesidades] = useState<NecesidadesEspeciales[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryNecesidadesEspecialesDto>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const fetchNecesidades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: QueryNecesidadesEspecialesDto = {
        ...filters,
        page,
        limit,
      };

      const response: NecesidadesEspecialesPaginatedResponse =
        await getAllNecesidadesEspeciales({
          ...queryParams,
          token: "your-token-here", // TODO: Get from auth context
        });

      setNecesidades(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las necesidades especiales"
      );
      console.error("Error fetching necesidades especiales:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchNecesidades();
  }, [fetchNecesidades]);

  const refresh = useCallback(() => {
    fetchNecesidades();
  }, [fetchNecesidades]);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const handleSetFilters = useCallback(
    (newFilters: Partial<QueryNecesidadesEspecialesDto>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1); // Reset to first page when changing filters
    },
    []
  );

  return {
    necesidades,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    refresh,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setFilters: handleSetFilters,
    filters,
  };
};

// Hook para obtener necesidades especiales por carga académica
export const useNecesidadesEspecialesByCargaAcademica = (
  cargaAcademicaId: number
) => {
  const [necesidades, setNecesidades] = useState<NecesidadesEspeciales[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNecesidades = useCallback(async () => {
    if (!cargaAcademicaId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getNecesidadesEspecialesByCargaAcademica({
        cargaAcademicaId: cargaAcademicaId.toString(),
        token: "your-token-here", // TODO: Get from auth context
      });
      setNecesidades(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las necesidades especiales"
      );
      console.error(
        "Error fetching necesidades especiales by carga academica:",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [cargaAcademicaId]);

  useEffect(() => {
    fetchNecesidades();
  }, [fetchNecesidades]);

  return {
    necesidades,
    loading,
    error,
    refresh: fetchNecesidades,
  };
};

// Hook para obtener una necesidad especial específica
export const useNecesidadesEspecialesById = (id: number) => {
  const [necesidad, setNecesidad] = useState<NecesidadesEspeciales | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNecesidad = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getNecesidadesEspecialesById({
        id: id.toString(),
        token: "your-token-here", // TODO: Get from auth context
      });
      setNecesidad(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar la necesidad especial"
      );
      console.error("Error fetching necesidad especial by id:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNecesidad();
  }, [fetchNecesidad]);

  return {
    necesidad,
    loading,
    error,
    refresh: fetchNecesidad,
  };
};
