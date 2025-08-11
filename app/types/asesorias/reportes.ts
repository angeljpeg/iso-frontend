// Tipos base para reportes de asesorías
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

export interface FiltrosReporteAsesoriasPorCarrera extends FiltrosReporteAsesorias {
  agruparPorCarrera?: boolean;
}

export interface FiltrosReporteAsesoriasPorProfesor extends FiltrosReporteAsesorias {
  agruparPorProfesor?: boolean;
}

export interface FiltrosReporteAsesoriasPorTema extends FiltrosReporteAsesorias {
  agruparPorTema?: boolean;
}

export interface FiltrosReporteEstadisticasAsesorias extends FiltrosReporteAsesorias {
  agruparPorSemana?: boolean;
  agruparPorCarrera?: boolean;
  agruparPorProfesor?: boolean;
  agruparPorAsignatura?: boolean;
  agruparPorGrupo?: boolean;
}

// Tipos para respuestas de reportes
export interface ReporteAsesoriasGeneral {
  totalAsesorias: number;
  resumenPorCarrera: Record<string, number>;
  resumenPorCuatrimestre: Record<string, number>;
  resumenPorProfesor: Record<string, number>;
  resumenPorTema: Record<string, number>;
  resumenPorGrupo: Record<string, number>;
  totalAlumnosAtendidos: number;
  totalHorasAsesorias: number;
  asesorias?: AsesoriaReporte[];
}

export interface ReporteAsesoriasPorCarrera {
  totalAsesorias: number;
  resumenPorCarrera: Record<string, ResumenDetalladoCarrera>;
  metricasGenerales: MetricasGenerales;
  asesorias?: AsesoriaReporte[];
}

export interface ReporteAsesoriasPorProfesor {
  totalAsesorias: number;
  resumenPorProfesor: Record<string, ResumenDetalladoProfesor>;
  metricasGenerales: MetricasGenerales & {
    promedioAsesoriasPorProfesor: string;
  };
  asesorias?: AsesoriaReporte[];
}

export interface ReporteAsesoriasPorTema {
  totalAsesorias: number;
  resumenPorTema: Record<string, ResumenDetalladoTema>;
  metricasGenerales: MetricasGenerales & {
    temasUnicos: number;
  };
  asesorias?: AsesoriaReporte[];
}

export interface ReporteEstadisticasAsesorias {
  totalAsesorias: number;
  totalAlumnosAtendidos: number;
  totalHorasAsesorias: number;
  promedioAlumnosPorAsesoria: string;
  promedioDuracionPorAsesoria: string;
  distribucionPorCarrera: Record<string, number>;
  distribucionPorCuatrimestre: Record<string, number>;
  distribucionPorProfesor: Record<string, number>;
  distribucionPorTema: Record<string, number>;
  distribucionPorGrupo: Record<string, number>;
  agrupaciones: Record<string, any>;
}

// Tipos para resúmenes detallados
export interface ResumenDetalladoCarrera {
  totalAsesorias: number;
  totalAlumnos: number;
  totalHoras: number;
  promedioAlumnos: string;
  promedioDuracion: string;
  asignaturas: Record<string, number>;
  profesores: Record<string, number>;
}

export interface ResumenDetalladoProfesor {
  totalAsesorias: number;
  totalAlumnos: number;
  totalHoras: number;
  promedioAlumnos: string;
  promedioDuracion: string;
  carreras: Record<string, number>;
  asignaturas: Record<string, number>;
  grupos: Record<string, number>;
}

export interface ResumenDetalladoTema {
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
  promedioAlumnosPorAsesoria: string;
  promedioDuracionPorAsesoria: string;
}

// Tipo para asesorías en reportes
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
    };
    grupo: {
      id: string;
      nombreGenerado: string;
    };
  };
  cuatrimestre: {
    id: string;
    nombreGenerado: string;
  };
}

// Tipos para reporte del dashboard
export interface ReporteDashboardAsesorias {
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
  distribucionPorCarrera: Record<string, number>;
  distribucionPorCuatrimestre: Record<string, number>;
}
