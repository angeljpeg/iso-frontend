import { useCargaAcademica } from "../../../hooks/useCargaAcademica";
import { useEstadias } from "../../../hooks/estadias-hooks";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/auth";
import { FORMATOS_ISO } from "../../../types/formatos";
import { FormatosSection } from "./FormatosSection";
import { GruposSection } from "./GruposSection";
import { EstadiasSection } from "./EstadiasSection";

export function ProfesorDashboardContent() {
  const navigate = useNavigate();
  const {
    cargasAcademicas,
    isLoading: isLoadingCargas,
    error: errorCargas,
    refetch: refetchCargas,
  } = useCargaAcademica();
  const {
    estadias,
    isLoading: isLoadingEstadias,
    error: errorEstadias,
    refetch: refetchEstadias,
  } = useEstadias({ onlyMyEstadias: true });
  const { usuario } = useAuthStore();

  // Filtrar formatos según el rol del usuario
  const formatosDisponibles = FORMATOS_ISO.map((formato) => ({
    ...formato,
    disponible:
      formato.id === "tutorias"
        ? usuario?.rol === "profesor_tiempo_completo"
        : formato.disponible,
  }));

  const gruposAsignados = cargasAcademicas.filter(
    (carga) => carga.profesorId === usuario?.id
  );

  const estadiasAsignadas = estadias.filter(
    (estadia) => estadia.profesorId === usuario?.id
  );

  const handleGrupoClick = (grupoId: string) => {
    navigate(`/grupo/${grupoId}`);
  };

  const handleEstadiaClick = (estadiaId: string) => {
    navigate(`/profesor/estadias/${estadiaId}`);
  };

  const handleRetryCargas = () => {
    if (refetchCargas) {
      refetchCargas();
    }
  };

  const handleRetryEstadias = () => {
    if (refetchEstadias) {
      refetchEstadias();
    }
  };

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      <FormatosSection formatos={formatosDisponibles} />

      <GruposSection
        cargasAcademicas={gruposAsignados}
        isLoading={isLoadingCargas}
        error={errorCargas}
        onGrupoClick={handleGrupoClick}
        onRetry={handleRetryCargas}
      />

      <EstadiasSection
        estadias={estadiasAsignadas}
        isLoading={isLoadingEstadias}
        error={errorEstadias}
        onEstadiaClick={handleEstadiaClick}
        onRetry={handleRetryEstadias}
      />
    </div>
  );
}
