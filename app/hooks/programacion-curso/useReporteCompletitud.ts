import { useState, useCallback } from "react";
import { useReporteGenerico } from "./useReporteGenerico";
import type {
  FiltrosReporteCompletitud,
  ReporteCompletitud,
} from "~/types/programacion-curso";

export function useReporteCompletitud(
  filtrosIniciales: FiltrosReporteCompletitud = {},
  autoFetch: boolean = true
) {
  const [filtros, setFiltros] =
    useState<FiltrosReporteCompletitud>(filtrosIniciales);

  const {
    reporte,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
  } = useReporteGenerico({
    tipo: "completitud",
    filtros,
    autoFetch,
  });

  const updateFiltros = useCallback(
    (nuevosFiltros: Partial<FiltrosReporteCompletitud>) => {
      const filtrosActualizados = { ...filtros, ...nuevosFiltros };
      setFiltros(filtrosActualizados);
    },
    [filtros]
  );

  const resetFiltros = useCallback(() => {
    setFiltros(filtrosIniciales);
  }, [filtrosIniciales]);

  const setRangoCompletitud = useCallback((minimo: number, maximo: number) => {
    setFiltros((prev) => ({
      ...prev,
      porcentajeMinimo: minimo,
      porcentajeMaximo: maximo,
    }));
  }, []);

  const toggleMetricasCalidad = useCallback(() => {
    setFiltros((prev) => ({
      ...prev,
      incluirMetricasCalidad: !prev.incluirMetricasCalidad,
    }));
  }, []);

  return {
    reporte: reporte as ReporteCompletitud | null,
    filtros,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
    updateFiltros,
    resetFiltros,
    setRangoCompletitud,
    toggleMetricasCalidad,
  };
}
