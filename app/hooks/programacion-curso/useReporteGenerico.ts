import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import {
  generarReporteSeguimientos,
  generarReporteAvance,
  generarReporteNotificaciones,
  generarReporteEstadisticas,
  generarReporteRetrasos,
  generarReporteCompletitud,
} from "~/services/reportes-seguimiento.service";
import type {
  FiltrosReporteSeguimiento,
  FiltrosReporteAvance,
  FiltrosReporteNotificaciones,
  FiltrosReporteEstadisticas,
  FiltrosReporteRetrasos,
  FiltrosReporteCompletitud,
  ReporteSeguimientos,
  ReporteAvance,
  ReporteNotificaciones,
  ReporteEstadisticas,
  ReporteRetrasos,
  ReporteCompletitud,
} from "~/types/programacion-curso";

type TipoReporte =
  | "seguimientos"
  | "avance"
  | "notificaciones"
  | "estadisticas"
  | "retrasos"
  | "completitud";

type FiltrosReporte =
  | FiltrosReporteSeguimiento
  | FiltrosReporteAvance
  | FiltrosReporteNotificaciones
  | FiltrosReporteEstadisticas
  | FiltrosReporteRetrasos
  | FiltrosReporteCompletitud;

type ReporteData =
  | ReporteSeguimientos
  | ReporteAvance
  | ReporteNotificaciones
  | ReporteEstadisticas
  | ReporteRetrasos
  | ReporteCompletitud;

interface UseReporteGenericoOptions {
  tipo: TipoReporte;
  filtros: FiltrosReporte;
  autoFetch?: boolean;
}

export function useReporteGenerico(options: UseReporteGenericoOptions) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [reporte, setReporte] = useState<ReporteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Memoizar las opciones para evitar re-renders innecesarios
  const memoizedOptions = useMemo(
    () => options,
    [options.tipo, JSON.stringify(options.filtros)]
  );

  const generarReporte = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let data: ReporteData;

      switch (memoizedOptions.tipo) {
        case "seguimientos":
          data = await generarReporteSeguimientos(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteSeguimiento
          );
          break;
        case "avance":
          data = await generarReporteAvance(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteAvance
          );
          break;
        case "notificaciones":
          data = await generarReporteNotificaciones(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteNotificaciones
          );
          break;
        case "estadisticas":
          data = await generarReporteEstadisticas(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteEstadisticas
          );
          break;
        case "retrasos":
          data = await generarReporteRetrasos(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteRetrasos
          );
          break;
        case "completitud":
          data = await generarReporteCompletitud(
            accessToken,
            memoizedOptions.filtros as FiltrosReporteCompletitud
          );
          break;
        default:
          throw new Error(`Tipo de reporte no válido: ${memoizedOptions.tipo}`);
      }

      setReporte(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error al generar reporte de ${memoizedOptions.tipo}`;
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

  const refresh = useCallback(() => {
    generarReporte();
  }, [generarReporte]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateFiltros = useCallback(
    (nuevosFiltros: Partial<FiltrosReporte>) => {
      // Esta función se puede usar para actualizar filtros específicos
      // y regenerar el reporte automáticamente
      const filtrosActualizados = {
        ...memoizedOptions.filtros,
        ...nuevosFiltros,
      };
      // Aquí se podrían actualizar los filtros en el componente padre
      // Por ahora solo regeneramos el reporte
      generarReporte();
    },
    [memoizedOptions.filtros, generarReporte]
  );

  // Auto-fetch cuando cambien las opciones
  useEffect(() => {
    if (options.autoFetch !== false) {
      generarReporte();
    }
  }, [generarReporte, options.autoFetch]);

  return {
    reporte,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
    updateFiltros,
  };
}
