import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import {
  GraficasGrid,
  GraficaBarras,
  GraficaPie,
  GraficaLinea,
  GraficaArea,
  convertirDatosParaGrafica,
  EstadisticaCard,
  Comparativa,
} from "./ReportesGraficas";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  BookOpen,
} from "lucide-react";

interface ReportesGraficasAvanzadasProps {
  reporteDashboard: any;
  reporteSeguimientos: any;
  reporteRetrasos: any;
  reporteCompletitud: any;
}

export function ReportesGraficasAvanzadas({
  reporteDashboard,
  reporteSeguimientos,
  reporteRetrasos,
  reporteCompletitud,
}: ReportesGraficasAvanzadasProps) {
  // Convertir datos para gráficas
  const datosEstados = convertirDatosParaGrafica(
    reporteDashboard?.distribuciones?.estados || {}
  );
  const datosCompletitud = convertirDatosParaGrafica(
    reporteDashboard?.distribuciones?.completitud || {}
  );
  const datosRetrasosPorSemana = convertirDatosParaGrafica(
    reporteRetrasos?.retrasosPorSemana || {}
  );
  const datosRetrasosPorAsignatura = convertirDatosParaGrafica(
    reporteRetrasos?.retrasosPorAsignatura || {}
  );
  const datosCompletitudPorAsignatura = convertirDatosParaGrafica(
    reporteCompletitud?.completitudPorAsignatura || {}
  );

  // Preparar datos para gráfica de completitud por asignatura (top 10)
  const topCompletitudAsignaturas = Object.entries(
    reporteCompletitud?.completitudPorAsignatura || {}
  )
    .sort(
      ([, a], [, b]) =>
        parseFloat((b as any).porcentaje) - parseFloat((a as any).porcentaje)
    )
    .slice(0, 10)
    .map(([asignatura, datos]) => ({
      name: asignatura,
      value: parseFloat((datos as any).porcentaje),
    }));

  // Preparar datos para gráfica de retrasos por semana
  const retrasosPorSemanaOrdenados = Object.entries(
    reporteRetrasos?.retrasosPorSemana || {}
  )
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([semana, cantidad]) => ({
      name: `Semana ${semana}`,
      value: cantidad as number,
    }));

  // Preparar datos para comparativa de completitud por profesor
  const comparativaProfesores = Object.entries(
    reporteCompletitud?.completitudPorProfesor || {}
  )
    .slice(0, 8)
    .map(([profesor, datos]) => ({
      etiqueta: profesor,
      valor: (datos as any).completados,
      total: (datos as any).total,
      color: "#3b82f6",
    }));

  return (
    <div className="space-y-8">
      {/* Gráficas principales */}
      <GraficasGrid cols={2}>
        <GraficaPie
          data={datosEstados}
          title="Distribución por Estados"
          description="Estado actual de los seguimientos de cursos"
          colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
        />

        <GraficaPie
          data={datosCompletitud}
          title="Distribución por Completitud"
          description="Porcentaje de completitud de los seguimientos"
          colors={["#ef4444", "#f59e0b", "#10b981", "#3b82f6"]}
        />
      </GraficasGrid>

      {/* Gráficas de retrasos */}
      <GraficasGrid cols={2}>
        <GraficaLinea
          data={retrasosPorSemanaOrdenados}
          title="Retrasos por Semana"
          description="Evolución de retrasos a lo largo del cuatrimestre"
          color="#ef4444"
        />

        <GraficaBarras
          data={topCompletitudAsignaturas}
          title="Top 10 Completitud por Asignatura"
          description="Asignaturas con mayor porcentaje de completitud"
          color="#10b981"
        />
      </GraficasGrid>

      {/* Gráficas de área para tendencias */}
      <GraficasGrid cols={1}>
        <GraficaArea
          data={datosRetrasosPorSemana}
          title="Tendencia de Retrasos"
          description="Análisis de la evolución de retrasos en el tiempo"
          color="#f59e0b"
        />
      </GraficasGrid>

      {/* Comparativas */}
      <GraficasGrid cols={2}>
        <Comparativa
          titulo="Completitud por Profesor (Top 8)"
          datos={comparativaProfesores}
        />

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Métricas</CardTitle>
            <CardDescription>Indicadores clave de rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <EstadisticaCard
                titulo="Total Seguimientos"
                valor={reporteDashboard?.resumen?.totalSeguimientos || 0}
                icono={<FileText className="h-6 w-6" />}
                color="#3b82f6"
              />

              <EstadisticaCard
                titulo="Total Detalles"
                valor={reporteDashboard?.resumen?.totalDetalles || 0}
                icono={<BarChart3 className="h-6 w-6" />}
                color="#10b981"
              />

              <EstadisticaCard
                titulo="Total Retrasos"
                valor={reporteDashboard?.resumen?.totalRetrasos || 0}
                icono={<AlertTriangle className="h-6 w-6" />}
                color="#ef4444"
              />

              <EstadisticaCard
                titulo="Promedio Completitud"
                valor={`${
                  reporteDashboard?.resumen?.promedioCompletitud || 0
                }%`}
                icono={<CheckCircle className="h-6 w-6" />}
                color="#8b5cf6"
              />
            </div>
          </CardContent>
        </Card>
      </GraficasGrid>

      {/* Gráficas adicionales */}
      <GraficasGrid cols={2}>
        <GraficaBarras
          data={datosRetrasosPorAsignatura}
          title="Retrasos por Asignatura"
          description="Asignaturas con mayor número de retrasos"
          color="#f59e0b"
        />

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Calidad</CardTitle>
            <CardDescription>
              Métricas de calidad de los seguimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reporteCompletitud?.metricasCalidad && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {
                          reporteCompletitud.metricasCalidad
                            .seguimientosConObservaciones
                        }
                      </p>
                      <p className="text-sm text-blue-700">Con Observaciones</p>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {
                          reporteCompletitud.metricasCalidad
                            .seguimientosConEvidencias
                        }
                      </p>
                      <p className="text-sm text-green-700">Con Evidencias</p>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">
                      {
                        reporteCompletitud.metricasCalidad
                          .seguimientosConAccionesCorrectivas
                      }
                    </p>
                    <p className="text-sm text-purple-700">
                      Con Acciones Correctivas
                    </p>
                  </div>
                </>
              )}

              {!reporteCompletitud?.metricasCalidad && (
                <p className="text-gray-500 text-center py-8">
                  No hay métricas de calidad disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </GraficasGrid>

      {/* Gráfica de tendencias temporales */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Temporal Completo</CardTitle>
          <CardDescription>
            Vista general de todas las métricas a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <GraficaLinea
              data={[
                { name: "Semana 1", value: 0 },
                { name: "Semana 2", value: 0 },
                { name: "Semana 3", value: 0 },
                { name: "Semana 4", value: 0 },
                { name: "Semana 5", value: 0 },
                { name: "Semana 6", value: 0 },
                { name: "Semana 7", value: 0 },
                { name: "Semana 8", value: 0 },
                { name: "Semana 9", value: 0 },
                { name: "Semana 10", value: 0 },
                { name: "Semana 11", value: 0 },
                { name: "Semana 12", value: 0 },
                { name: "Semana 13", value: 0 },
                { name: "Semana 14", value: 0 },
                { name: "Semana 15", value: 0 },
                { name: "Semana 16", value: 0 },
              ]}
              title=""
              description=""
              color="#6366f1"
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Gráfica temporal de seguimientos, retrasos y completitud por semana
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
