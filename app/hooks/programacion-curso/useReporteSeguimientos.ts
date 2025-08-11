import { useState, useCallback } from "react";
import { useReporteGenerico } from "./useReporteGenerico";
import type {
  FiltrosReporteSeguimiento,
  ReporteSeguimientos,
} from "~/types/programacion-curso";

export function useReporteSeguimientos(
  filtrosIniciales: FiltrosReporteSeguimiento = {},
  autoFetch: boolean = true
) {
  const [filtros, setFiltros] =
    useState<FiltrosReporteSeguimiento>(filtrosIniciales);

  const {
    reporte,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
  } = useReporteGenerico({
    tipo: "seguimientos",
    filtros,
    autoFetch,
  });

  const updateFiltros = useCallback(
    (nuevosFiltros: Partial<FiltrosReporteSeguimiento>) => {
      const filtrosActualizados = { ...filtros, ...nuevosFiltros };
      setFiltros(filtrosActualizados);
    },
    [filtros]
  );

  const resetFiltros = useCallback(() => {
    setFiltros(filtrosIniciales);
  }, [filtrosIniciales]);

  return {
    reporte: reporte as ReporteSeguimientos | null,
    filtros,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
    updateFiltros,
    resetFiltros,
  };
}
