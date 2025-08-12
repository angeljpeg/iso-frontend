import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { BarChart3, FileText, Download, TrendingUp } from "lucide-react";

interface ReportesSectionProps {
  periodoId?: string;
  profesorId?: string;
}

export function ReportesSection({
  periodoId,
  profesorId,
}: ReportesSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Reportes de Estadías
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Genera reportes y análisis de las estadías académicas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            disabled
          >
            <Download className="h-4 w-4" />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Placeholder para reportes */}
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          Reportes en Desarrollo
        </h4>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Los reportes y análisis de estadías estarán disponibles próximamente.
          Incluirán gráficas, estadísticas y métricas de rendimiento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Métricas de Progreso</h5>
            <p className="text-sm text-gray-500">
              Análisis del avance de los alumnos
            </p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Reportes Detallados</h5>
            <p className="text-sm text-gray-500">
              Informes completos por período
            </p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900">Gráficas Avanzadas</h5>
            <p className="text-sm text-gray-500">
              Visualizaciones interactivas
            </p>
          </div>
        </div>
      </div>

      {/* Información de filtros aplicados */}
      {(periodoId || profesorId) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Filtros Aplicados para Reportes:
          </h5>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {periodoId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Período: {periodoId}
              </span>
            )}
            {profesorId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Profesor: {profesorId}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
