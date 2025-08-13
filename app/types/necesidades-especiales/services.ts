import { type NecesidadesEspeciales } from "./entities";

// Respuesta paginada para listar necesidades especiales
export interface NecesidadesEspecialesPaginatedResponse {
  data: NecesidadesEspeciales[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para reportes
export interface ResumenGeneral {
  totalRegistros: number;
  totalAlumnos: number;
  totalCarreras: number;
  totalProfesores: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  distribucionPorCarrera: Array<{
    carrera: string;
    total: number;
    porcentaje: number;
  }>;
  distribucionPorMes: Array<{
    mes: string;
    total: number;
  }>;
}

export interface ReportePorTipoNecesidad {
  tipo: string;
  total: number;
  porcentaje: number;
  detalles: Array<{
    id: number;
    nombreAlumno: string;
    numeroMatricula: string;
    programaEducativo: string;
    especificacion: string;
    fecha: string;
  }>;
}

export interface ReportePorCarrera {
  carrera: string;
  total: number;
  porcentaje: number;
  tiposNecesidad: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  alumnos: Array<{
    id: number;
    nombre: string;
    matricula: string;
    tiposNecesidad: string[];
  }>;
}

export interface ReportePorProfesor {
  profesorId: number;
  nombreProfesor: string;
  totalAlumnos: number;
  totalNecesidades: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  alumnos: Array<{
    id: number;
    nombre: string;
    matricula: string;
    programaEducativo: string;
    tiposNecesidad: string[];
  }>;
}

export interface TendenciaMensual {
  mes: string;
  total: number;
  variacion: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
}

export interface ExportarExcelResponse {
  mensaje: string;
  datos: ResumenGeneral;
  formato: string;
  timestamp: string;
}
