export interface Estadia {
  id: string;
  nombreProfesor: string;
  profesorId: string;
  periodo: string;
  observacionesGenerales?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  profesor?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  alumnos?: EstadiaAlumno[];
}

export interface EstadiaAlumno {
  id: string;
  nombreAlumno: string;
  matricula?: string;
  carrera?: string;
  estadiaId: string;
  observacionesGenerales?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  estadia?: Estadia;
  progresoMensual?: ProgresoMensual[];
}

export enum Mes {
  MES_1 = 1,
  MES_2 = 2,
  MES_3 = 3,
  MES_4 = 4,
}

export enum AvanceAlumno {
  SI = 'si',
  NO = 'no',
}

export interface ProgresoMensual {
  id: string;
  estadiaAlumnoId: string;
  mes: Mes;
  avance?: AvanceAlumno;
  accionesTomadas?: string;
  fechaEvaluacion?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  estadiaAlumno?: EstadiaAlumno;
}

// DTOs para crear/actualizar
export interface CreateEstadiaDto {
  nombreProfesor: string;
  periodo: string;
  observacionesGenerales?: string;
}

export interface UpdateEstadiaDto extends Partial<CreateEstadiaDto> {}

export interface CreateEstadiaAlumnoDto {
  nombreAlumno: string;
  matricula?: string;
  carrera?: string;
  estadiaId: string;
  observacionesGenerales?: string;
}

export interface UpdateEstadiaAlumnoDto extends Partial<CreateEstadiaAlumnoDto> {}

export interface CreateProgresoMensualDto {
  estadiaAlumnoId: string;
  mes: Mes;
  avance?: AvanceAlumno;
  accionesTomadas?: string;
  fechaEvaluacion?: string;
  observaciones?: string;
}

export interface UpdateProgresoMensualDto extends Partial<CreateProgresoMensualDto> {}

// Tipos para reportes
export interface ReporteEstadia extends Estadia {
  alumnos: (EstadiaAlumno & {
    progresoMensual: ProgresoMensual[];
  })[];
}

// Tipos para filtros y búsquedas
export interface EstadiasFilters {
  periodo?: string;
  profesorId?: string;
  activo?: boolean;
}

export interface AlumnosFilters {
  estadiaId?: string;
  carrera?: string;
  activo?: boolean;
}
