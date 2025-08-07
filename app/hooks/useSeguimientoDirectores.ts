import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { seguimientoService } from "../services/seguimiento";
import type {
  Seguimiento,
  FiltroSeguimiento,
  EstadisticasSeguimiento,
  NotificacionSeguimiento,
} from "../types/seguimiento";

export function useSeguimientoDirectores() {
  const navigate = useNavigate();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasSeguimiento | null>(null);
  const [notificaciones, setNotificaciones] = useState<
    NotificacionSeguimiento[]
  >([]);
  const [filtros, setFiltros] = useState<FiltroSeguimiento>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEstadisticas, setIsLoadingEstadisticas] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeguimientos = useCallback(
    async (filtrosAplicados?: FiltroSeguimiento) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await seguimientoService.getAllSeguimientos(
          filtrosAplicados || filtros
        );
        setSeguimientos(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar los seguimientos";
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
    },
    [filtros, navigate]
  );

  const fetchEstadisticas = useCallback(
    async (filtrosAplicados?: FiltroSeguimiento) => {
      try {
        setIsLoadingEstadisticas(true);
        const data = await seguimientoService.getEstadisticas(
          filtrosAplicados || filtros
        );
        setEstadisticas(data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      } finally {
        setIsLoadingEstadisticas(false);
      }
    },
    [filtros]
  );

  const fetchNotificaciones = useCallback(async () => {
    try {
      const data = await seguimientoService.getNotificaciones();
      setNotificaciones(data);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    }
  }, []);

  const aplicarFiltros = useCallback(
    async (nuevosFiltros: FiltroSeguimiento) => {
      setFiltros(nuevosFiltros);
      await Promise.all([
        fetchSeguimientos(nuevosFiltros),
        fetchEstadisticas(nuevosFiltros),
      ]);
    },
    [fetchSeguimientos, fetchEstadisticas]
  );

  const revisarSeguimiento = useCallback(
    async (
      id: string,
      estado: "aprobado" | "rechazado",
      comentarios?: string
    ) => {
      try {
        const seguimientoRevisado = await seguimientoService.revisarSeguimiento(
          id,
          estado,
          comentarios
        );
        setSeguimientos((prev) =>
          prev.map((seg) => (seg.id === id ? seguimientoRevisado : seg))
        );

        // Actualizar estadísticas después de la revisión
        await fetchEstadisticas();

        return seguimientoRevisado;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al revisar el seguimiento";
        throw new Error(errorMessage);
      }
    },
    [fetchEstadisticas]
  );

  const marcarNotificacionLeida = useCallback(async (id: string) => {
    try {
      await seguimientoService.marcarNotificacionLeida(id);
      setNotificaciones((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  }, []);

  const exportarReporte = useCallback(
    async (formato: "pdf" | "excel" = "pdf") => {
      try {
        const blob = await seguimientoService.exportarReporte(filtros, formato);

        // Crear URL del blob y descargar
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-seguimiento.${formato}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al exportar el reporte";
        throw new Error(errorMessage);
      }
    },
    [filtros]
  );

  useEffect(() => {
    Promise.all([
      fetchSeguimientos(),
      fetchEstadisticas(),
      fetchNotificaciones(),
    ]);
  }, [fetchSeguimientos, fetchEstadisticas, fetchNotificaciones]);

  return {
    seguimientos,
    estadisticas,
    notificaciones,
    filtros,
    isLoading,
    isLoadingEstadisticas,
    error,
    aplicarFiltros,
    revisarSeguimiento,
    marcarNotificacionLeida,
    exportarReporte,
    refetch: () => fetchSeguimientos(),
  };
}
