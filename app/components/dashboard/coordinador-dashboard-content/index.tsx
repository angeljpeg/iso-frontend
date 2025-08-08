import { Button } from "~/components/ui/Button";

import { useSeguimientoDirectores } from "~/hooks/useSeguimientoDirectores";
import { AlertTriangle } from "lucide-react";
import { ConfiguracionRapida } from "./configuracion-rapida";
import { FormatosSection } from "~/components/dashboard/profesor-dashboard-content/FormatosSection";

import { FORMATOS_ISO } from "~/types/formatos";

export function CoordinadorDashboardContent() {
  const { error } = useSeguimientoDirectores();

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
