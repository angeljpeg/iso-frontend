import { useState, useEffect } from "react";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { PDFDownloadLinkComponent } from "../pdf/PDFDownloader";

interface ReportesSectionProps {
  cuatrimestreId?: string;
  profesorId?: string;
}

interface ReporteAsesorias {
  totalAsesorias: number;
  totalAlumnosAtendidos: number;
  totalHorasAsesorias: number;
  promedioDuracion: number;
  asesoriasPorMes: Array<{
    mes: string;
    cantidad: number;
    alumnos: number;
    horas: number;
  }>;
  topAsignaturas: Array<{
    nombre: string;
    cantidad: number;
    alumnos: number;
    horas: number;
  }>;
  topProfesores: Array<{
    nombre: string;
    apellido: string;
    cantidad: number;
    alumnos: number;
    horas: number;
  }>;
}

export function ReportesSection({ cuatrimestreId, profesorId }: ReportesSectionProps) {
  const [reporte, setReporte] = useState<ReporteAsesorias | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data para el reporte (en producción vendría de la API)
  const mockReporte: ReporteAsesorias = {
    totalAsesorias: 45,
    totalAlumnosAtendidos: 128,
    totalHorasAsesorias: 67.5,
    promedioDuracion: 90,
    asesoriasPorMes: [
      { mes: "Enero", cantidad: 8, alumnos: 22, horas: 12 },
      { mes: "Febrero", cantidad: 12, alumnos: 35, horas: 18 },
      { mes: "Marzo", cantidad: 15, alumnos: 42, horas: 22.5 },
      { mes: "Abril", cantidad: 10, alumnos: 29, horas: 15 },
    ],
    topAsignaturas: [
      { nombre: "Programación Web", cantidad: 12, alumnos: 35, horas: 18 },
      { nombre: "Bases de Datos", cantidad: 10, alumnos: 28, horas: 15 },
      { nombre: "Desarrollo Móvil", cantidad: 8, alumnos: 22, horas: 12 },
      { nombre: "Redes", cantidad: 6, alumnos: 18, horas: 9 },
    ],
    topProfesores: [
      { nombre: "Juan", apellido: "Pérez", cantidad: 15, alumnos: 42, horas: 22.5 },
      { nombre: "María", apellido: "García", cantidad: 12, alumnos: 35, horas: 18 },
      { nombre: "Carlos", apellido: "López", cantidad: 10, alumnos: 28, horas: 15 },
      { nombre: "Ana", apellido: "Martínez", cantidad: 8, alumnos: 23, horas: 12 },
    ],
  };

  const generarReporte = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReporte(mockReporte);
    } catch (err) {
      setError("Error al generar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generarReporte();
  }, [cuatrimestreId, profesorId]);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p className="mb-4">{error}</p>
          <Button onClick={generarReporte} variant="outline">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  if (!reporte) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generando reporte...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del reporte */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Reporte de Asesorías</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Estadísticas y métricas de asesorías académicas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={generarReporte}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <PDFDownloadLinkComponent
            seguimientos={[]} // TODO: Adaptar para asesorías
            titulo="Reporte de Asesorías - Estadísticas"
            filtros={{}}
          >
            <Button size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </PDFDownloadLinkComponent>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Asesorías</p>
              <p className="text-2xl font-bold text-gray-900">{reporte.totalAsesorias}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Alumnos Atendidos</p>
              <p className="text-2xl font-bold text-gray-900">{reporte.totalAlumnosAtendidos}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Horas</p>
              <p className="text-2xl font-bold text-gray-900">{reporte.totalHorasAsesorias}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio Duración</p>
              <p className="text-2xl font-bold text-gray-900">{reporte.promedioDuracion}min</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asesorías por mes */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Asesorías por Mes</h4>
          <div className="space-y-3">
            {reporte.asesoriasPorMes.map((item) => (
              <div key={item.mes} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{item.cantidad} asesorías</Badge>
                  <span className="text-sm text-gray-600">{item.alumnos} alumnos</span>
                  <span className="text-sm text-gray-600">{item.horas}h</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top asignaturas */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Asignaturas</h4>
          <div className="space-y-3">
            {reporte.topAsignaturas.map((asignatura, index) => (
              <div key={asignatura.nombre} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium text-gray-700">{asignatura.nombre}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{asignatura.cantidad}</Badge>
                  <span className="text-sm text-gray-600">{asignatura.alumnos} alumnos</span>
                  <span className="text-sm text-gray-600">{asignatura.horas}h</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top profesores */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Profesores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reporte.topProfesores.map((profesor, index) => (
            <div key={`${profesor.nombre}-${profesor.apellido}`} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-blue-600">{index + 1}</span>
              </div>
              <h5 className="font-medium text-gray-900 mb-1">
                {profesor.nombre} {profesor.apellido}
              </h5>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{profesor.cantidad} asesorías</p>
                <p>{profesor.alumnos} alumnos</p>
                <p>{profesor.horas} horas</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
