import { useState, useEffect } from "react";
import type {
  SeguimientoCurso,
  SeguimientosResponse,
  SeguimientosFiltros,
} from "~/types/seguimientos";
import { getAuthHeaders } from "../utils/auth";

const API_BASE_URL = "http://localhost:3000";

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

  const fetchSeguimientos = async (
    currentFiltros: SeguimientosFiltros = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Construir query parameters
      const params = new URLSearchParams();
      if (currentFiltros.page)
        params.append("page", currentFiltros.page.toString());
      if (currentFiltros.limit)
        params.append("limit", currentFiltros.limit.toString());
      if (currentFiltros.profesorId)
        params.append("profesorId", currentFiltros.profesorId);
      if (currentFiltros.estado) params.append("estado", currentFiltros.estado);
      if (currentFiltros.semana) params.append("semana", currentFiltros.semana);
      if (currentFiltros.cuatrimestreId)
        params.append("cuatrimestreId", currentFiltros.cuatrimestreId);

      const response = await fetch(
        `${API_BASE_URL}/programacion-seguimiento-curso?${params.toString()}`,
        {
          method: "GET",
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
  };

  useEffect(() => {
    fetchSeguimientos(filtros);
  }, []);

  const refetch = (newFiltros?: SeguimientosFiltros) => {
    const finalFiltros = { ...filtros, ...newFiltros };
    fetchSeguimientos(finalFiltros);
  };

  return {
    seguimientos,
    loading,
    error,
    pagination,
    refetch,
  };
}
