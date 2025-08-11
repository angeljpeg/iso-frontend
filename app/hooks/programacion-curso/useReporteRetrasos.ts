import { useState, useCallback } from "react";
import { useReporteGenerico } from "./useReporteGenerico";
import type {
  FiltrosReporteRetrasos,
  ReporteRetrasos,
} from "~/types/programacion-curso";

export function useReporteRetrasos(
  filtrosIniciales: FiltrosReporteRetrasos = {},
  autoFetch: boolean = true
) {
  const [filtros, setFiltros] =
    useState<FiltrosReporteRetrasos>(filtrosIniciales);

  const {
    reporte,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
  } = useReporteGenerico({
    tipo: "retrasos",
    filtros,
    autoFetch,
  });

  const updateFiltros = useCallback(
    (nuevosFiltros: Partial<FiltrosReporteRetrasos>) => {
      const filtrosActualizados = { ...filtros, ...nuevosFiltros };
      setFiltros(filtrosActualizados);
    },
    [filtros]
  );

  const resetFiltros = useCallback(() => {
    setFiltros(filtrosIniciales);
  }, [filtrosIniciales]);

  const toggleIncluirJustificaciones = useCallback(() => {
    setFiltros((prev) => ({
      ...prev,
      incluirJustificaciones: !prev.incluirJustificaciones,
    }));
  }, []);

  const toggleIncluirAccionesCorrectivas = useCallback(() => {
    setFiltros((prev) => ({
      ...prev,
      incluirAccionesCorrectivas: !prev.incluirAccionesCorrectivas,
    }));
  }, []);

  return {
    reporte: reporte as ReporteRetrasos | null,
    filtros,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    generarReporte,
    updateFiltros,
    resetFiltros,
    toggleIncluirJustificaciones,
    toggleIncluirAccionesCorrectivas,
  };
}
