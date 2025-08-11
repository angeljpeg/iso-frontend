import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  getAllCargaAcademica,
  getMyCarga,
} from "~/services/carga-academica.service";
import { useAuthStore } from "~/store/auth";
import type { CargaAcademica } from "~/types/carga-academica";
import type { GetAllCargaAcademicaResponse } from "~/types/carga-academica/services/get-all";

interface UseCargaAcademicaOptions {
  profesorId?: string;
  cuatrimestreId?: string;
  grupoId?: string;
  carrera?: string;
  asignatura?: string;
  activo?: boolean;
  actual?: boolean;
  esTutor?: boolean;
  page?: number;
  limit?: number;
  onlyMyCarga?: boolean; // Nueva opción para obtener solo mi carga
}

export function useCargaAcademica(
  initialOptions: UseCargaAcademicaOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [cargasAcademicas, setCargasAcademicas] = useState<CargaAcademica[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseCargaAcademicaOptions>({
    page: 1,
    limit: 10,
    actual: true, // Por defecto traer solo las actuales
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
      options.grupoId,
      options.carrera,
      options.asignatura,
      options.activo,
      options.actual,
      options.esTutor,
      options.page,
      options.limit,
      options.onlyMyCarga,
    ]
  );

  const fetchCargaAcademica = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (memoizedOptions.onlyMyCarga) {
        // Obtener solo mi carga académica
        const response = await getMyCarga({
          token: accessToken,
          actual: memoizedOptions.actual?.toString(),
        });

        // Agrupar por grupo para evitar duplicados (como en el hook original)
        const gruposUnicos = new Map<string, CargaAcademica>();

        response.data.forEach((cargaAcademica) => {
          const grupoId = cargaAcademica.grupo.id;
          if (!gruposUnicos.has(grupoId)) {
            gruposUnicos.set(grupoId, cargaAcademica);
          }
        });

        const cargasUnicas = Array.from(gruposUnicos.values());
        setCargasAcademicas(cargasUnicas);

        // Para mi carga no hay paginación
        setPagination({
          total: cargasUnicas.length,
          page: 1,
          limit: cargasUnicas.length,
          totalPages: 1,
        });
      } else {
        // Obtener todas las cargas académicas con filtros
        const requestParams = {
          token: accessToken,
          profesorId: memoizedOptions.profesorId,
          cuatrimestreId: memoizedOptions.cuatrimestreId,
          grupoId: memoizedOptions.grupoId,
          carrera: memoizedOptions.carrera,
          asignatura: memoizedOptions.asignatura,
          activo: memoizedOptions.activo?.toString(),
          actual: memoizedOptions.actual?.toString(),
          esTutor: memoizedOptions.esTutor?.toString(),
          page: memoizedOptions.page?.toString(),
          limit: memoizedOptions.limit?.toString(),
        };

        const response: GetAllCargaAcademicaResponse =
          await getAllCargaAcademica(requestParams);

        setCargasAcademicas(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar carga académica";
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
    fetchCargaAcademica();
  }, [fetchCargaAcademica]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseCargaAcademicaOptions>) => {
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
      actual: true, // Mantener el filtro de actual por defecto
      onlyMyCarga: options.onlyMyCarga, // Mantener el tipo de consulta
    });
  }, [options.limit, options.onlyMyCarga]);

  return {
    cargasAcademicas,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch: fetchCargaAcademica,
  };
}

// Hook específico para obtener solo mi carga académica (mantiene compatibilidad con el hook original)
export function useMyCargaAcademica() {
  return useCargaAcademica({ onlyMyCarga: true });
}
