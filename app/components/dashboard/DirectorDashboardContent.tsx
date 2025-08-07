import { useState } from "react";
import { useSeguimientoDirectores } from "../../hooks/useSeguimientoDirectores";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { EstadoBadge } from "../ui/EstadoBadge";
import { IndicadorRetraso } from "../ui/IndicadorRetraso";
import type { FiltroSeguimiento } from "../../types/seguimiento";

export function DirectorDashboardContent() {
  const {
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
  } = useSeguimientoDirectores();

  // Estados para el modal de revisión
  const [modalRevision, setModalRevision] = useState<{
    isOpen: boolean;
    seguimientoId: string;
    estado: "aprobado" | "rechazado";
  }>({
    isOpen: false,
    seguimientoId: "",
    estado: "aprobado",
  });

  const [comentariosRevision, setComentariosRevision] = useState("");

  // Resto de la lógica del dashboard de director...
  // (Copiar el contenido del return del DirectorDashboardPage original)

  return (
    <div className="space-y-6">
      {/* Notificaciones */}
      {notificaciones.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔔 Notificaciones (
            {notificaciones.filter((n) => !n.leida).length} nuevas)
          </h3>
          <div className="space-y-2">
            {notificaciones.slice(0, 5).map((notificacion) => (
              <div
                key={notificacion.id}
                className={`p-3 rounded-lg border ${
                  notificacion.leida
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                } cursor-pointer hover:shadow-sm transition-shadow`}
                onClick={() => marcarNotificacionLeida(notificacion.id)}
              >
                <p className="text-sm font-medium text-gray-900">
                  {notificacion.mensaje}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notificacion.fechaCreacion).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Resumen de Seguimientos
        </h3>
        {isLoadingEstadisticas ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {estadisticas?.totalSeguimientos || 0}
              </p>
              <p className="text-sm text-blue-800">Total</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {estadisticas?.seguimientosPendientes || 0}
              </p>
              <p className="text-sm text-yellow-800">Pendientes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {estadisticas?.seguimientosAprobados || 0}
              </p>
              <p className="text-sm text-green-800">Aprobados</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {estadisticas?.retrasosCriticos || 0}
              </p>
              <p className="text-sm text-red-800">Críticos</p>
            </div>
          </div>
        )}
      </div>

      {/* Resto del contenido del dashboard de director */}
      {/* ... */}
    </div>
  );
}