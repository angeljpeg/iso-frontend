import { GraduationCap } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import type { Estadia } from "~/types/estadias";

interface EstadiasSectionProps {
  estadias: Estadia[];
  isLoading: boolean;
  error: string | null;
  onEstadiaClick: (estadiaId: string) => void;
  onRetry?: () => void;
}

export function EstadiasSection({
  estadias,
  isLoading,
  error,
  onEstadiaClick,
  onRetry,
}: EstadiasSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Estadías Asignadas"
        description="Gestiona el seguimiento de tus estadías del cuatrimestre actual"
        icon={<GraduationCap />}
      />

      {isLoading && <LoadingState message="Cargando estadías..." />}

      {error && <ErrorState error={error} onRetry={onRetry} />}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estadias.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No hay estadías asignadas"
                description="No tienes estadías asignadas para este cuatrimestre. Contacta con la administración si crees que esto es un error."
              />
            </div>
          ) : (
            estadias.map((estadia) => (
              <EstadiaCard
                key={estadia.id}
                estadia={estadia}
                onClick={() => onEstadiaClick(estadia.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface EstadiaCardProps {
  estadia: Estadia;
  onClick: () => void;
}

function EstadiaCard({ estadia, onClick }: EstadiaCardProps) {
  const totalAlumnos = estadia.alumnos.length;
  const alumnosActivos = estadia.alumnos.filter(
    (alumno) => alumno.activo
  ).length;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Estadía {estadia.periodo}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {estadia.observacionesGenerales || "Sin observaciones generales"}
          </p>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            estadia.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {estadia.activo ? "Activa" : "Inactiva"}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total de alumnos:</span>
          <span className="font-medium text-gray-900">{totalAlumnos}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Alumnos activos:</span>
          <span className="font-medium text-gray-900">{alumnosActivos}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Fecha creación:</span>
          <span className="font-medium text-gray-900">
            {new Date(estadia.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Ver detalles →
        </button>
      </div>
    </div>
  );
}
