export interface CreateNecesidadesEspecialesDto {
  fecha: string;
  nombreAlumno: string;
  numeroMatricula: string;
  programaEducativo: string;
  fechaRevision: string;
  numeroRevision: number;
  excepcionesConductuales: boolean;
  especificacionConductual?: string;
  excepcionesComunicacionales: boolean;
  especificacionComunicacional?: string;
  excepcionesIntelectuales: boolean;
  especificacionIntelectual?: string;
  excepcionesFisicas: boolean;
  especificacionFisica?: string;
  excepcionesSuperdotacion: boolean;
  especificacionSuperdotacion?: string;
  otrasNecesidades?: string;
  cargaAcademicaId: number;
}

export interface UpdateNecesidadesEspecialesDto {
  fecha?: string;
  nombreAlumno?: string;
  numeroMatricula?: string;
  programaEducativo?: string;
  fechaRevision?: string;
  numeroRevision?: number;
  excepcionesConductuales?: boolean;
  especificacionConductual?: string;
  excepcionesComunicacionales?: boolean;
  especificacionComunicacional?: string;
  excepcionesIntelectuales?: boolean;
  especificacionIntelectual?: string;
  excepcionesFisicas?: boolean;
  especificacionFisica?: string;
  excepcionesSuperdotacion?: boolean;
  especificacionSuperdotacion?: string;
  otrasNecesidades?: string;
  cargaAcademicaId?: number;
}

export interface QueryNecesidadesEspecialesDto {
  nombreAlumno?: string;
  numeroMatricula?: string;
  programaEducativo?: string;
  nombreProfesor?: string;
  cargaAcademicaId?: number;
  excepcionesConductuales?: boolean;
  excepcionesComunicacionales?: boolean;
  excepcionesIntelectuales?: boolean;
  excepcionesFisicas?: boolean;
  excepcionesSuperdotacion?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}

export interface NecesidadesEspecialesResponseDto extends CreateNecesidadesEspecialesDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  cargaAcademica?: {
    id: number;
    usuario: {
      id: number;
      nombre: string;
    };
  };
}
