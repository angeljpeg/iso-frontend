import React from "react";
import { Button } from "~/components/ui/Button";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";

interface ReportesSectionProps {
  periodoId?: string;
  profesorId?: string;
}

export function ReportesSection({ periodoId, profesorId }: ReportesSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Reportes y Estadísticas
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implementar generación de reportes
            console.log("Generar reporte con filtros:", { periodoId, profesorId });
          }}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          Generar Reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estadísticas generales */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total de Tutorías</p>
              <p className="text-2xl font-semibold text-blue-900">0</p>
            </div>
          </div>
        </div>

        {/* Estado de revisión */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Revisadas</p>
              <p className="text-2xl font-semibold text-green-900">0</p>
            </div>
          </div>
        </div>

        {/* Pendientes de revisión */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pendientes</p>
              <p className="text-2xl font-semibold text-yellow-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Los reportes detallados estarán disponibles próximamente. 
          Esta sección mostrará estadísticas, gráficos y análisis de las tutorías.
        </p>
      </div>
    </div>
  );
}
