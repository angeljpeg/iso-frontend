export interface NecesidadesEspeciales {
  id: number;
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
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  cargaAcademica?: CargaAcademicaNecesidades;
}

export interface CargaAcademicaNecesidades {
  id: number;
  usuario?: UsuarioNecesidades;
}

export interface UsuarioNecesidades {
  id: number;
  nombre: string;
  email?: string;
}
