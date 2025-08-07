export interface SeguimientoCurso {
  id: string;
  cargaAcademicaId: string;
  cuatrimestreId: string;
  semana: number;
  estado: string;
  observacionesProfesor: string;
  observacionesDirector: string | null;
  justificacionRetraso: string | null;
  tieneRetrasosCriticos: boolean;
  diasRetraso: number;
  revisadoPorId: string | null;
  fechaRevision: string | null;
  fechaEnvio: string | null;
  cargaAcademica: {
    id: string;
    profesorId: string;
    asignaturaId: string;
    grupoId: string;
    cuatrimestreId: string;
    activo: boolean;
    profesor: {
      id: string;
      nombre: string;
      apellido: string;
      rol: string;
    };
    asignatura: {
      id: string;
      nombre: string;
      carrera: string;
    };
    grupo: {
      id: string;
      carrera: string;
      cuatrimestre: number;
      numeroGrupo: number;
      nombreGenerado: string;
    };
  };
  cuatrimestre: {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    nombreGenerado: string;
    activo: boolean;
  };
  detalles: any[];
  createdAt: string;
  updatedAt: string;
}

export interface SeguimientosResponse {
  data: SeguimientoCurso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SeguimientosFiltros {
  profesorId?: string;
  estado?: string;
  semana?: string;
  conRetrasos?: boolean;
  page?: number;
  limit?: number;
  cuatrimestreId?: string;
}

// Nuevas interfaces para crear seguimientos
export interface CreateSeguimientoCursoDto {
  cargaAcademicaId: string;
  cuatrimestreId: string;
  semana: number;
  observacionesProfesor?: string;
  justificacionRetraso?: string;
  detalles: CreateSeguimientoDetalleDto[];
}

export interface CreateSeguimientoDetalleDto {
  temaId: string;
  estadoAvance: "no_iniciado" | "en_progreso" | "completado" | "retrasado";
  observaciones?: string;
  horasProgramadas?: number;
  requiereRecuperacion?: boolean;
}
