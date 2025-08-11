// Servicios principales
export * from "./asesorias.service";
export * from "./asignaturas.service";
export * from "./carga-academica.service";
export * from "./cuatrimestres";
export * from "./estadias";
export * from "./grupos";
export * from "./programacion-curso.service";
export * from "./tutorias.service";
export * from "./auth";

// Servicios de seguimiento
export * from "./seguimiento";

// Servicios de reportes - Exportaciones explícitas para evitar conflictos
export {
  generarReporteGeneral,
  generarReportePorCarrera,
  generarReportePorProfesor,
  generarReportePorTema,
  generarReporteEstadisticas,
  generarReporteDashboard,
} from "./reportes-asesorias.service";

export {
  generarReporteSeguimientos,
  generarReporteAvance,
  generarReporteNotificaciones,
  generarReporteEstadisticas as generarReporteEstadisticasSeguimiento,
  generarReporteRetrasos,
  generarReporteCompletitud,
  generarReporteDashboard as generarReporteDashboardSeguimiento,
  exportarReporte,
} from "./reportes-seguimiento.service";

// Configuración de API
export * from "./api-config";
