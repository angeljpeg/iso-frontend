import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { EstadoBadge } from "../ui/EstadoBadge";
import { IndicadorRetraso } from "../ui/IndicadorRetraso";
import { useSeguimientoDirectores } from "../../hooks/useSeguimientoDirectores";
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import type { EstadoSeguimiento, NivelRetraso } from "~/types/seguimiento";
import { ConfiguracionRapida } from "./coordinador-dashboard-content/configuracion-rapida";
import { FormatosSection } from "./profesor-dashboard-content/FormatosSection";
import { FORMATOS_ISO } from "~/types/formatos";

export function CoordinadorDashboardContent() {
  const { error, aplicarFiltros, marcarNotificacionLeida } =
    useSeguimientoDirectores();

  const [filtros, setFiltros] = useState({
    profesor: "",
    grupo: "",
    carrera: "",
    estado: "",
  });

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-red-600">
          <AlertTriangle className="mx-auto mb-2 w-12 h-12" />
          <p className="text-lg font-semibold">Error al cargar los datos</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormatosSection formatos={FORMATOS_ISO} />
      {/* Configuración Rápida */}
      <ConfiguracionRapida />
    </div>
  );
}
