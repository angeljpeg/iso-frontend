// Interfaces para los reportes de asesorías

export interface ReporteAsesoriaBase {
  totalAsesorias: number;
  totalAlumnosAtendidos: number;
  totalHorasAsesorias: number;
}

export interface ResumenPorCarrera {
  totalAsesorias: number;
  totalAlumnos: number;
  totalHoras: number;
  promedioAlumnos: string;
  promedioDuracion: string;
  asignaturas: Record<string, number>;
  profesores: Record<string, number>;
}

export interface ResumenPorProfesor {
  totalAsesorias: number;
  totalAlumnos: number;
  totalHoras: number;
  promedioAlumnos: string;
  promedioDuracion: string;
  carreras: Record<string, number>;
  asignaturas: Record<string, number>;
  grupos: Record<string, number>;
}

export interface ResumenPorTema {
  totalAsesorias: number;
  totalAlumnos: number;
  totalHoras: number;
  promedioAlumnos: string;
  promedioDuracion: string;
  carreras: Record<string, number>;
  asignaturas: Record<string, number>;
  profesores: Record<string, number>;
}

export interface MetricasGenerales {
  totalAlumnosAtendidos: number;
  totalHorasAsesorias: number;
  promedioAlumnosPorAsesoria?: string;
  promedioDuracionPorAsesoria?: string;
  promedioAsesoriasPorProfesor?: string;
  temasUnicos?: number;
}

export interface AsesoriaReporte {
  id: string;
  temaAsesoria: string;
  fecha: string;
  numeroAlumnos: number;
  nombreAlumno: string;
  duracionAsesoria: number;
  cargaAcademica: {
    id: string;
    carrera: string;
    asignatura: string;
    profesor: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
    };
    grupo: {
      id: string;
      nombreGenerado: string;
      carrera: string;
      cuatrimestre: number;
      numeroGrupo: number;
    };
  };
  cuatrimestre: {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    nombreGenerado: string;
    activo: boolean;
  };
}

// Reporte General
export interface ReporteGeneralAsesorias extends ReporteAsesoriaBase {
  resumenPorCarrera: Record<string, number>;
  resumenPorCuatrimestre: Record<string, number>;
  resumenPorProfesor: Record<string, number>;
  resumenPorTema: Record<string, number>;
  resumenPorGrupo: Record<string, number>;
  asesorias?: AsesoriaReporte[];
}

// Reporte por Carrera
export interface ReporteAsesoriasPorCarrera extends ReporteAsesoriaBase {
  resumenPorCarrera: Record<string, ResumenPorCarrera>;
  metricasGenerales: MetricasGenerales;
  asesorias?: AsesoriaReporte[];
}

// Reporte por Profesor
export interface ReporteAsesoriasPorProfesor extends ReporteAsesoriaBase {
  resumenPorProfesor: Record<string, ResumenPorProfesor>;
  metricasGenerales: MetricasGenerales;
  asesorias?: AsesoriaReporte[];
}

// Reporte por Tema
export interface ReporteAsesoriasPorTema extends ReporteAsesoriaBase {
  resumenPorTema: Record<string, ResumenPorTema>;
  metricasGenerales: MetricasGenerales;
  asesorias?: AsesoriaReporte[];
}

// Reporte Estadístico
export interface ReporteEstadisticasAsesorias extends ReporteAsesoriaBase {
  promedioAlumnosPorAsesoria: string;
  promedioDuracionPorAsesoria: string;
  distribucionPorCarrera: Record<string, number>;
  distribucionPorCuatrimestre: Record<string, number>;
  distribucionPorProfesor: Record<string, number>;
  distribucionPorTema: Record<string, number>;
  distribucionPorGrupo: Record<string, number>;
  agrupaciones: {
    porSemana?: Record<string, number>;
    porCarrera?: Record<string, number>;
    porProfesor?: Record<string, number>;
    porAsignatura?: Record<string, number>;
    porGrupo?: Record<string, number>;
  };
}

// Reporte de Dashboard
export interface ReporteDashboardAsesorias extends ReporteAsesoriaBase {
  promedioAlumnosPorAsesoria: string;
  promedioDuracionPorAsesoria: string;
  topCarreras: Array<{ carrera: string; total: number }>;
  topProfesores: Array<{ profesor: string; total: number }>;
  topTemas: Array<{ tema: string; total: number }>;
  distribucionPorCuatrimestre: Record<string, number>;
}

// Filtros para reportes
export interface FiltrosReporteAsesorias {
  cuatrimestreId?: string;
  profesorId?: string;
  carrera?: string;
  asignatura?: string;
  grupoId?: string;
  temaAsesoria?: string;
  fechaInicio?: string;
  fechaFin?: string;
  numeroAlumnosMinimo?: number;
  numeroAlumnosMaximo?: number;
  duracionMinima?: number;
  duracionMaxima?: number;
  incluirDetalles?: boolean;
}

export interface FiltrosReporteAsesoriasPorCarrera
  extends FiltrosReporteAsesorias {
  incluirMetricasPorAsignatura?: boolean;
  incluirMetricasPorProfesor?: boolean;
}

export interface FiltrosReporteAsesoriasPorProfesor
  extends FiltrosReporteAsesorias {
  incluirMetricasPorCarrera?: boolean;
  incluirMetricasPorAsignatura?: boolean;
  incluirMetricasPorGrupo?: boolean;
}

export interface FiltrosReporteAsesoriasPorTema
  extends FiltrosReporteAsesorias {
  incluirMetricasPorCarrera?: boolean;
  incluirMetricasPorAsignatura?: boolean;
  incluirMetricasPorProfesor?: boolean;
}

export interface FiltrosReporteEstadisticasAsesorias
  extends FiltrosReporteAsesorias {
  agruparPorSemana?: boolean;
  agruparPorCarrera?: boolean;
  agruparPorProfesor?: boolean;
  agruparPorAsignatura?: boolean;
  agruparPorGrupo?: boolean;
  incluirMetricasTiempo?: boolean;
  incluirMetricasAlumnos?: boolean;
}

// Tipos de respuesta de la API
export interface ApiResponseReporteGeneral {
  data: ReporteGeneralAsesorias;
  success: boolean;
  message?: string;
}

export interface ApiResponseReportePorCarrera {
  data: ReporteAsesoriasPorCarrera;
  success: boolean;
  message?: string;
}

export interface ApiResponseReportePorProfesor {
  data: ReporteAsesoriasPorProfesor;
  success: boolean;
  message?: string;
}

export interface ApiResponseReportePorTema {
  data: ReporteAsesoriasPorTema;
  success: boolean;
  message?: string;
}

export interface ApiResponseReporteEstadisticas {
  data: ReporteEstadisticasAsesorias;
  success: boolean;
  message?: string;
}

export interface ApiResponseReporteDashboard {
  data: ReporteDashboardAsesorias;
  success: boolean;
  message?: string;
}

// Union type para todos los tipos de reporte
export type TipoReporteAsesoria =
  | "general"
  | "por-carrera"
  | "por-profesor"
  | "por-tema"
  | "estadisticas"
  | "dashboard";

// Configuración para generación de reportes
export interface ConfiguracionReporte {
  tipo: TipoReporteAsesoria;
  filtros:
    | FiltrosReporteAsesorias
    | FiltrosReporteAsesoriasPorCarrera
    | FiltrosReporteAsesoriasPorProfesor
    | FiltrosReporteAsesoriasPorTema
    | FiltrosReporteEstadisticasAsesorias;
  formato?: "json" | "csv" | "pdf";
  incluirGraficos?: boolean;
}
