import { useState, useEffect, useCallback } from "react";
import type {
  SeguimientoCurso,
  SeguimientosResponse,
  SeguimientosFiltros,
} from "~/types/seguimientos";
import { getAuthHeaders } from "../utils/auth";
import { API_BASE_URL } from "~/services/api-config";

export function useSeguimientos(filtros: SeguimientosFiltros = {}) {
  const [seguimientos, setSeguimientos] = useState<SeguimientoCurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchSeguimientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/programacion-seguimiento-curso`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: SeguimientosResponse = await response.json();

      setSeguimientos(data.data);
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar seguimientos"
      );
      console.error("Error fetching seguimientos:", err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  const refetch = () => {
    fetchSeguimientos();
  };

  return {
    seguimientos,
    loading,
    error,
    pagination,
    refetch,
  };
}
