import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  RefreshCw,
  PieChart,
} from "lucide-react";
import { useReporteDashboard } from "~/hooks/programacion-curso/useReporteDashboard";
import { useReporteGenerico } from "~/hooks/programacion-curso/useReporteGenerico";
import { ReportesGraficasAvanzadas } from "./ReportesGraficasAvanzadas";
import type {
  FiltrosReporteSeguimiento,
  FiltrosReporteAvance,
  FiltrosReporteRetrasos,
  FiltrosReporteCompletitud,
  ReporteCompletitud,
} from "~/types/programacion-curso";

interface ReportesSectionProps {
  cuatrimestreId?: string;
  profesorId?: string;
}

export function ReportesSection({
  cuatrimestreId,
  profesorId,
}: ReportesSectionProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filtrosBase] = useState({
    cuatrimestreId,
    profesorId,
    incluirDetalles: false,
  });

  // Hook para reporte de dashboard
  const {
    reporte: dashboardReporte,
    isLoading: isLoadingDashboard,
    error: errorDashboard,
    refresh: refreshDashboard,
  } = useReporteDashboard();

  // Hook para reporte de seguimientos
  const {
    reporte: seguimientosReporte,
    isLoading: isLoadingSeguimientos,
    error: errorSeguimientos,
    refresh: refreshSeguimientos,
  } = useReporteGenerico({
    tipo: "seguimientos",
    filtros: filtrosBase as FiltrosReporteSeguimiento,
    autoFetch: false,
  });

  // Hook para reporte de retrasos
  const {
    reporte: retrasosReporte,
    isLoading: isLoadingRetrasos,
    error: errorRetrasos,
    refresh: refreshRetrasos,
  } = useReporteGenerico({
    tipo: "retrasos",
    filtros: filtrosBase as FiltrosReporteRetrasos,
    autoFetch: false,
  });

  // Hook para reporte de completitud
  const {
    reporte: completitudReporte,
    isLoading: isLoadingCompletitud,
    error: errorCompletitud,
    refresh: refreshCompletitud,
  } = useReporteGenerico({
    tipo: "completitud",
    filtros: filtrosBase as FiltrosReporteCompletitud,
    autoFetch: false,
  });

  const handleRefreshAll = () => {
    refreshDashboard();
    refreshSeguimientos();
    refreshRetrasos();
    refreshCompletitud();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Cargar el reporte correspondiente cuando se cambie de tab
    switch (value) {
      case "seguimientos":
        refreshSeguimientos();
        break;
      case "retrasos":
        refreshRetrasos();
        break;
      case "completitud":
        refreshCompletitud();
        break;
      default:
        break;
    }
  };

  if (errorDashboard) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-700">
              Error al cargar reportes: {errorDashboard}
            </p>
            <Button
              onClick={handleRefreshAll}
              variant="outline"
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de Reportes */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Reportes y Estadísticas
          </h2>
          <p className="text-gray-600 mt-1">
            Análisis detallado del seguimiento de cursos y métricas de
            rendimiento
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRefreshAll}
            variant="outline"
            size="sm"
            disabled={isLoadingDashboard}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isLoadingDashboard ? "animate-spin" : ""
              }`}
            />
            Actualizar Todo
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs de Reportes */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="seguimientos">Seguimientos</TabsTrigger>
          <TabsTrigger value="retrasos">Retrasos</TabsTrigger>
          <TabsTrigger value="completitud">Completitud</TabsTrigger>
          <TabsTrigger value="graficas">Gráficas</TabsTrigger>
        </TabsList>

        {/* Tab Dashboard */}
        <TabsContent value="dashboard" className="space-y-4">
          <DashboardTab
            reporte={dashboardReporte}
            isLoading={isLoadingDashboard}
          />
        </TabsContent>

        {/* Tab Seguimientos */}
        <TabsContent value="seguimientos" className="space-y-4">
          <SeguimientosTab
            reporte={seguimientosReporte}
            isLoading={isLoadingSeguimientos}
            error={errorSeguimientos}
            onRefresh={refreshSeguimientos}
          />
        </TabsContent>

        {/* Tab Retrasos */}
        <TabsContent value="retrasos" className="space-y-4">
          <RetrasosTab
            reporte={retrasosReporte}
            isLoading={isLoadingRetrasos}
            error={errorRetrasos}
            onRefresh={refreshRetrasos}
          />
        </TabsContent>

        {/* Tab Completitud */}
        <TabsContent value="completitud" className="space-y-4">
          <CompletitudTab
            reporte={completitudReporte}
            isLoading={isLoadingCompletitud}
            error={errorCompletitud}
            onRefresh={refreshCompletitud}
          />
        </TabsContent>

        {/* Tab Gráficas Avanzadas */}
        <TabsContent value="graficas" className="space-y-4">
          <GraficasAvanzadasTab
            reporteDashboard={dashboardReporte as any}
            reporteSeguimientos={seguimientosReporte as any}
            reporteRetrasos={retrasosReporte as any}
            reporteCompletitud={completitudReporte as any}
            isLoading={
              isLoadingDashboard ||
              isLoadingSeguimientos ||
              isLoadingRetrasos ||
              isLoadingCompletitud
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para el tab de Gráficas Avanzadas
function GraficasAvanzadasTab({
  reporteDashboard,
  reporteSeguimientos,
  reporteRetrasos,
  reporteCompletitud,
  isLoading,
}: {
  reporteDashboard: any;
  reporteSeguimientos: any;
  reporteRetrasos: any;
  reporteCompletitud: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando gráficas avanzadas...</p>
      </div>
    );
  }

  if (
    !reporteDashboard &&
    !reporteSeguimientos &&
    !reporteRetrasos &&
    !reporteCompletitud
  ) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <PieChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos para mostrar gráficas
            </h3>
            <p className="text-gray-500">
              Los reportes deben ser generados primero para poder mostrar las
              gráficas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gráficas y Análisis Visual
        </h3>
        <p className="text-gray-600">
          Visualización avanzada de métricas y tendencias del seguimiento de
          cursos
        </p>
      </div>

      <ReportesGraficasAvanzadas
        reporteDashboard={reporteDashboard}
        reporteSeguimientos={reporteSeguimientos}
        reporteRetrasos={reporteRetrasos}
        reporteCompletitud={reporteCompletitud}
      />
    </div>
  );
}

// Componente para el tab de Dashboard
function DashboardTab({
  reporte,
  isLoading,
}: {
  reporte: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reporte) return null;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">
                Total Seguimientos
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {reporte.resumen?.totalSeguimientos || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">
                Total Detalles
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {reporte.resumen?.totalDetalles || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600">
                Total Retrasos
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {reporte.resumen?.totalRetrasos || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">
                Promedio Completitud
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {reporte.resumen?.promedioCompletitud || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Estados</CardTitle>
            <CardDescription>
              Estado actual de los seguimientos de cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reporte.distribuciones?.estados ? (
              <div className="space-y-3">
                {Object.entries(reporte.distribuciones.estados).map(
                  ([estado, cantidad]) => (
                    <div
                      key={estado}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {estado.replace("_", " ")}
                      </span>
                      <Badge variant="secondary">{cantidad as number}</Badge>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Distribución por Completitud
            </CardTitle>
            <CardDescription>
              Porcentaje de completitud de los seguimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reporte.distribuciones?.completitud ? (
              <div className="space-y-3">
                {Object.entries(reporte.distribuciones.completitud).map(
                  ([rango, cantidad]) => (
                    <div
                      key={rango}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {rango}
                      </span>
                      <Badge variant="secondary">{cantidad as number}</Badge>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Última actualización */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500">
            Última actualización:{" "}
            {reporte.ultimaActualizacion
              ? new Date(reporte.ultimaActualizacion).toLocaleString("es-ES")
              : "No disponible"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para el tab de Seguimientos
function SeguimientosTab({
  reporte,
  isLoading,
  error,
  onRefresh,
}: {
  reporte: any;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reporte de seguimientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-700">Error: {error}</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reporte) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button onClick={onRefresh} variant="outline">
              Generar Reporte de Seguimientos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reporte.totalSeguimientos}
              </p>
              <p className="text-sm text-gray-600">Total Seguimientos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Object.keys(reporte.resumenPorEstado || {}).length}
              </p>
              <p className="text-sm text-gray-600">Estados Diferentes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Object.keys(reporte.resumenPorProfesor || {}).length}
              </p>
              <p className="text-sm text-gray-600">Profesores Involucrados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Reporte</CardTitle>
          <CardDescription>
            Información detallada de los seguimientos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Por Estado:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(reporte.resumenPorEstado || {}).map(
                  ([estado, cantidad]) => (
                    <div
                      key={estado}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm capitalize">
                        {estado.replace("_", " ")}
                      </span>
                      <Badge variant="secondary">{cantidad as number}</Badge>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Por Cuatrimestre:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(reporte.resumenPorCuatrimestre || {}).map(
                  ([cuatrimestre, cantidad]) => (
                    <div
                      key={cuatrimestre}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{cuatrimestre}</span>
                      <Badge variant="secondary">{cantidad as number}</Badge>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para el tab de Retrasos
function RetrasosTab({
  reporte,
  isLoading,
  error,
  onRefresh,
}: {
  reporte: any;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reporte de retrasos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-700">Error: {error}</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reporte) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button onClick={onRefresh} variant="outline">
              Generar Reporte de Retrasos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de retrasos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Análisis de Retrasos</CardTitle>
          <CardDescription>
            Total de retrasos: {reporte.totalRetrasos || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {Object.keys(reporte.retrasosPorSemana || {}).length}
              </p>
              <p className="text-sm text-red-700">Semanas con Retrasos</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {Object.keys(reporte.retrasosPorAsignatura || {}).length}
              </p>
              <p className="text-sm text-orange-700">Asignaturas Afectadas</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {Object.keys(reporte.retrasosPorProfesor || {}).length}
              </p>
              <p className="text-sm text-yellow-700">Profesores con Retrasos</p>
            </div>

            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-2xl font-bold text-pink-600">
                {Object.keys(reporte.retrasosPorTema || {}).length}
              </p>
              <p className="text-sm text-pink-700">Temas Retrasados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retrasos por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            {reporte.retrasosPorSemana ? (
              <div className="space-y-2">
                {Object.entries(reporte.retrasosPorSemana)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([semana, cantidad]) => (
                    <div
                      key={semana}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">
                        Semana {semana}
                      </span>
                      <Badge variant="destructive">{cantidad as number}</Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retrasos por Asignatura</CardTitle>
          </CardHeader>
          <CardContent>
            {reporte.retrasosPorAsignatura ? (
              <div className="space-y-2">
                {Object.entries(reporte.retrasosPorAsignatura)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 10)
                  .map(([asignatura, cantidad]) => (
                    <div
                      key={asignatura}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium truncate">
                        {asignatura}
                      </span>
                      <Badge variant="destructive">{cantidad as number}</Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No hay datos disponibles
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente para el tab de Completitud
function CompletitudTab({
  reporte,
  isLoading,
  error,
  onRefresh,
}: {
  reporte: any;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reporte de completitud...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-700">Error: {error}</p>
            <Button onClick={onRefresh} variant="outline" className="mt-2">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reporte) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button onClick={onRefresh} variant="outline">
              Generar Reporte de Completitud
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de completitud */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">
            Análisis de Completitud
          </CardTitle>
          <CardDescription>
            Total de seguimientos: {reporte.totalSeguimientos || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(reporte.distribucionCompletitud || {}).map(
              ([rango, cantidad]) => (
                <div
                  key={rango}
                  className="text-center p-4 bg-green-50 rounded-lg"
                >
                  <p className="text-2xl font-bold text-green-600">
                    {cantidad as number}
                  </p>
                  <p className="text-sm text-green-700">{rango}</p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completitud por asignatura */}
      <Card>
        <CardHeader>
          <CardTitle>Completitud por Asignatura</CardTitle>
          <CardDescription>
            Porcentaje de completitud por asignatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(reporte.completitudPorAsignatura || {})
              .sort(
                ([, a], [, b]) =>
                  parseFloat((b as any).porcentaje) -
                  parseFloat((a as any).porcentaje)
              )
              .slice(0, 10)
              .map(([asignatura, datos]) => (
                <div
                  key={asignatura}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{asignatura}</p>
                    <p className="text-sm text-gray-600">
                      {(datos as any).completados} de {(datos as any).total}{" "}
                      detalles
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {(datos as any).porcentaje}%
                    </p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(datos as any).porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Completitud por profesor */}
      <Card>
        <CardHeader>
          <CardTitle>Completitud por Profesor</CardTitle>
          <CardDescription>
            Porcentaje de completitud por profesor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(reporte.completitudPorProfesor || {})
              .sort(
                ([, a], [, b]) =>
                  parseFloat((b as any).porcentaje) -
                  parseFloat((a as any).porcentaje)
              )
              .slice(0, 10)
              .map(([profesor, datos]) => (
                <div
                  key={profesor}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{profesor}</p>
                    <p className="text-sm text-gray-600">
                      {(datos as any).completados} de {(datos as any).total}{" "}
                      detalles
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {(datos as any).porcentaje}%
                    </p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(datos as any).porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
