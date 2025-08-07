import { useCargaAcademica } from "../../../hooks/useCargaAcademica";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/auth";
import { FORMATOS_ISO, type FormatoCard } from "../../../types/formatos";
import { FormatosSection } from "./FormatosSection";
import { GruposSection } from "./GruposSection";

export function ProfesorDashboardContent() {
  const navigate = useNavigate();
  const { cargasAcademicas, isLoading, error, refetch } = useCargaAcademica();
  const { usuario } = useAuthStore();

  // Filtrar formatos según el rol del usuario
  const formatosDisponibles = FORMATOS_ISO.map((formato) => ({
    ...formato,
    disponible:
      formato.id === "tutorias"
        ? usuario?.rol === "profesor_tiempo_completo"
        : formato.disponible,
  }));

  const handleFormatoClick = (formato: FormatoCard) => {
    if (formato.disponible) {
      navigate(formato.ruta);
    }
  };

  const handleGrupoClick = (grupoId: string) => {
    navigate(`/grupo/${grupoId}`);
  };

  const handleRetry = () => {
    if (refetch) {
      refetch();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <FormatosSection
        formatos={formatosDisponibles}
        onFormatoClick={handleFormatoClick}
      />
      
      <GruposSection
        cargasAcademicas={cargasAcademicas}
        isLoading={isLoading}
        error={error}
        onGrupoClick={handleGrupoClick}
        onRetry={handleRetry}
      />
    </div>
  );
}
