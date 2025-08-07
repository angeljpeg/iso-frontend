import { Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { GrupoCard } from "../../GrupoCard";
import type { CargaAcademica } from "~/types/carga-academica";

interface GruposSectionProps {
  cargasAcademicas: CargaAcademica[];
  isLoading: boolean;
  error: string | null;
  onGrupoClick: (grupoId: string) => void;
  onRetry?: () => void;
}

export function GruposSection({
  cargasAcademicas,
  isLoading,
  error,
  onGrupoClick,
  onRetry,
}: GruposSectionProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Grupos Asignados"
        description="Gestiona el seguimiento de tus asignaturas del cuatrimestre actual"
        icon={<Users />}
      />

      {isLoading && <LoadingState message="Cargando grupos..." />}

      {error && <ErrorState error={error} onRetry={onRetry} />}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cargasAcademicas.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No hay grupos asignados"
                description="No tienes grupos asignados para este cuatrimestre. Contacta con la administración si crees que esto es un error."
              />
            </div>
          ) : (
            cargasAcademicas.map((carga) => (
              <GrupoCard
                key={carga.id}
                cargaAcademica={carga}
                onClick={() => onGrupoClick(carga.grupo.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
