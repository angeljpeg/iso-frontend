// Tipos para los reportes de seguimiento
export interface FiltrosReporteSeguimiento {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  semana?: number;
  fechaInicio?: string;
  fechaFin?: string;
  conRetrasos?: boolean;
  pendientesRevision?: boolean;
  incluirDetalles?: boolean;
}

export interface FiltrosReporteAvance {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  estadoAvance?: string;
  tema?: string;
  semana?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface FiltrosReporteNotificaciones {
  usuarioId?: string;
  tipo?: string;
  estado?: string;
  noLeidas?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface FiltrosReporteEstadisticas {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  agruparPorSemana?: boolean;
  agruparPorAsignatura?: boolean;
  agruparPorGrupo?: boolean;
}

export interface FiltrosReporteRetrasos {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  tema?: string;
  semana?: number;
  fechaInicio?: string;
  fechaFin?: string;
  incluirJustificaciones?: boolean;
  incluirAccionesCorrectivas?: boolean;
}

export interface FiltrosReporteCompletitud {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  porcentajeMinimo?: number;
  porcentajeMaximo?: number;
  incluirMetricasCalidad?: boolean;
}

// Respuestas de los reportes
export interface ReporteSeguimientos {
  totalSeguimientos: number;
  resumenPorEstado: Record<string, number>;
  resumenPorCuatrimestre: Record<string, number>;
  resumenPorProfesor: Record<string, number>;
  seguimientos: Array<{
    id: string;
    estado: string;
    fechaEntregado: string | null;
    fechaRevision: string | null;
    numeroRevision: number;
    cargaAcademica: {
      id: string;
      profesor: any;
      asignatura: any;
      grupo: any;
    };
    cuatrimestre: any;
    totalDetalles: number;
    detallesCompletados: number;
    detallesRetrasados: number;
  }>;
}

export interface ReporteAvance {
  totalDetalles: number;
  resumenPorEstado: Record<string, number>;
  resumenPorSemana: Record<number, number>;
  resumenPorTema: Record<string, number>;
  resumenPorAsignatura: Record<string, number>;
  detalles: Array<{
    id: string;
    tema: string;
    semanaTerminada: number;
    estadoAvance: string;
    retraso: boolean;
    observaciones: string | null;
    justificacion: string | null;
    acciones: string | null;
    evidencias: string | null;
    seguimiento: {
      id: string;
      estado: string;
      fechaEntregado: string | null;
    };
    cargaAcademica: {
      profesor: any;
      asignatura: any;
      grupo: any;
    };
  }>;
}

export interface ReporteNotificaciones {
  totalNotificaciones: number;
  resumenPorTipo: Record<string, number>;
  resumenPorEstado: Record<string, number>;
  resumenPorUsuario: Record<string, number>;
  resumenPorFecha: Record<string, number>;
  notificaciones: Array<{
    id: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    estado: string;
    fechaEnvio: string | null;
    fechaLectura: string | null;
    usuario: {
      id: string;
      nombre: string;
      email: string;
    };
    seguimiento: {
      id: string;
      estado: string;
    } | null;
  }>;
}

export interface ReporteEstadisticas {
  totalSeguimientos: number;
  totalDetalles: number;
  promedioDetallesPorSeguimiento: string;
  distribucionEstados: Record<string, number>;
  distribucionAvance: Record<string, number>;
  metricasTiempo: {
    promedioDiasEntrega: number;
    promedioDiasRevision: number;
    seguimientosSinFechaEntrega: number;
    seguimientosSinFechaRevision: number;
  };
  agrupaciones: Record<string, any>;
}

export interface ReporteRetrasos {
  totalRetrasos: number;
  retrasosPorSemana: Record<number, number>;
  retrasosPorAsignatura: Record<string, number>;
  retrasosPorProfesor: Record<string, number>;
  retrasosPorTema: Record<string, number>;
  analisisRetrasos: {
    temasMasRetrasados: Record<string, number>;
    semanasConMasRetrasos: Record<number, number>;
    profesoresConMasRetrasos: Record<string, number>;
    asignaturasConMasRetrasos: Record<string, number>;
  };
  detalles: Array<{
    id: string;
    tema: string;
    semanaTerminada: number;
    estadoAvance: string;
    justificacion?: string;
    acciones?: string;
    seguimiento: {
      id: string;
      estado: string;
      fechaEntregado: string | null;
    };
    cargaAcademica: {
      profesor: any;
      asignatura: any;
      grupo: any;
    };
  }>;
}

export interface ReporteCompletitud {
  totalSeguimientos: number;
  distribucionCompletitud: Record<string, number>;
  completitudPorAsignatura: Record<string, {
    total: number;
    completados: number;
    porcentaje: string;
  }>;
  completitudPorProfesor: Record<string, {
    total: number;
    completados: number;
    porcentaje: string;
  }>;
  completitudPorGrupo: Record<string, {
    total: number;
    completados: number;
    porcentaje: string;
  }>;
  metricasCalidad?: {
    seguimientosConObservaciones: number;
    seguimientosConEvidencias: number;
    seguimientosConAccionesCorrectivas: number;
    promedioObservacionesPorDetalle: string | number;
    promedioEvidenciasPorDetalle: string | number;
  };
  seguimientos: Array<{
    id: string;
    estado: string;
    porcentajeCompletitud: string;
    totalDetalles: number;
    detallesCompletados: number;
    detallesRetrasados: number;
    cargaAcademica: {
      profesor: any;
      asignatura: any;
      grupo: any;
    };
    cuatrimestre: any;
  }>;
}

export interface ReporteDashboard {
  resumen: {
    totalSeguimientos: number;
    totalDetalles: number;
    totalRetrasos: number;
    promedioCompletitud: number;
  };
  distribuciones: {
    estados: Record<string, number>;
    avance: Record<string, number>;
    completitud: Record<string, number>;
  };
  metricas: {
    retrasosPorSemana: Record<number, number>;
    completitudPorAsignatura: Record<string, {
      total: number;
      completados: number;
      porcentaje: string;
    }>;
  };
  ultimaActualizacion: string;
}

// Tipos para las respuestas de la API
export interface ReporteSeguimientosResponse {
  data: ReporteSeguimientos;
  message?: string;
  success: boolean;
}

export interface ReporteAvanceResponse {
  data: ReporteAvance;
  message?: string;
  success: boolean;
}

export interface ReporteNotificacionesResponse {
  data: ReporteNotificaciones;
  message?: string;
  success: boolean;
}

export interface ReporteEstadisticasResponse {
  data: ReporteEstadisticas;
  message?: string;
  success: boolean;
}

export interface ReporteRetrasosResponse {
  data: ReporteRetrasos;
  message?: string;
  success: boolean;
}

export interface ReporteCompletitudResponse {
  data: ReporteCompletitud;
  message?: string;
  success: boolean;
}

export interface ReporteDashboardResponse {
  data: ReporteDashboard;
  message?: string;
  success: boolean;
}
