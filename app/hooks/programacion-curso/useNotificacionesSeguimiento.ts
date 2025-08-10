import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getNotificaciones } from "~/services/programacion-curso.service";
import type { NotificacionSeguimiento } from "~/types/programacion-curso";
import type { GetNotificacionesParams } from "~/types/programacion-curso/servicios";

interface UseNotificacionesSeguimientoOptions extends GetNotificacionesParams {
  autoFetch?: boolean;
}

export function useNotificacionesSeguimiento(
  initialOptions: UseNotificacionesSeguimientoOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [notificaciones, setNotificaciones] = useState<NotificacionSeguimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<UseNotificacionesSeguimientoOptions>({
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
      options.page,
      options.limit,
      options.usuarioId,
      options.seguimientoCursoId,
      options.tipo,
      options.estado,
      options.fechaDesde,
      options.fechaHasta,
    ]
  );

  const fetchNotificaciones = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getNotificaciones({
        token: accessToken,
        ...memoizedOptions,
      });

      setNotificaciones(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar notificaciones";
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
    (newOptions: Partial<UseNotificacionesSeguimientoOptions>) => {
      setOptions((prev) => ({
        ...prev,
        ...newOptions,
        page: newOptions.page !== undefined ? newOptions.page : 1, // Reset page when filters change
      }));
    },
    []
  );

  const refresh = useCallback(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch cuando cambien las options
  useEffect(() => {
    if (options.autoFetch) {
      fetchNotificaciones();
    }
  }, [fetchNotificaciones, options.autoFetch]);

  return {
    notificaciones,
    isLoading,
    error,
    pagination,
    options,
    updateOptions,
    refresh,
    clearError,
    fetchNotificaciones,
  };
}
