// Enums para las tutorías
export enum EstadoProfesor {
  EN_PROGRESO = "en progreso",
  COMPLETADO = "completado",
}

export enum EstadoRevision {
  SIN_REVISAR = "sin revisar",
  REVISADO = "revisado",
  REVISANDO = "revisando",
  ACEPTADO = "aceptado",
  RECHAZADO = "rechazado",
}

export enum Vulnerabilidad {
  ACADEMICA = "academica",
  PERSONAL = "personal",
  SOCIOECONOMICA = "socioeconomica",
}

export enum AreaCanalizacion {
  ASESORIA = "Asesoria",
  MEDICO = "Medico",
  PSICOLOGO = "Psicologo",
  ESTUDIANTILES = "Estudiantiles",
  ADMON = "Admon",
  VINCULACION = "Vinculacion",
  DIRECCION_CARRERA = "Direccion de Carrera",
  OTRA = "Otra",
}

export enum CausaNoAtencion {
  NO_PERSONAL = "No había personal que atendiera en el área",
  NO_ASISTIO = "El alumno no asistió al área canalizada",
}

export enum CausaBaja {
  SIN_CAUSA = "Sin causa conocida",
  INCUMPLIMIENTO = "Incumplimiento de expectativas",
  REPROBACION = "Reprobación",
  PROBLEMAS_ECONOMICOS = "Problemas económicos",
  MOTIVOS_PERSONALES = "Motivos personales",
  DISTANCIA_UT = "Distancia de la UT",
  PROBLEMAS_TRABAJO = "Problemas de trabajo",
  CAMBIO_UT = "Cambio de UT",
  CAMBIO_CARRERA = "Cambio de carrera",
  FALTAS_REGLAMENTO = "Faltas al reglamento escolar",
  OTRAS_CAUSAS = "Otras causas",
}

// Interfaces principales
export interface Tutoria {
  id: number;
  cuatrimestre: string;
  nombreTutor: string;
  grupo: string;
  carrera: string;
  fecha: string;
  fechaRevision?: string;
  observaciones?: string;
  actividadesTutoriaGrupal?: string[];
  estado: EstadoProfesor;
  estadoRevision: EstadoRevision;
  cargaAcademicaId: string;
  detalles: TutoriaDetalle[];
  createdAt: string;
  updatedAt: string;
}

export interface TutoriaDetalle {
  id: number;
  nombreAlumno: string;
  vulnerabilidad: Vulnerabilidad;
  areaCanalizacion: AreaCanalizacion;
  fueAtendido: boolean;
  causaNoAtencion?: CausaNoAtencion;
  presentoMejoria: boolean;
  causoBaja: boolean;
  causaBaja?: CausaBaja;
  tutoriaId: number;
  createdAt: string;
  updatedAt: string;
}

// DTOs para crear/actualizar
export interface CreateTutoriaDto {
  cuatrimestre: string;
  nombreTutor: string;
  grupo: string;
  carrera: string;
  fecha: string;
  observaciones?: string;
  actividadesTutoriaGrupal?: string[];
  cargaAcademicaId: string;
}

export interface CreateTutoriaDetalleDto {
  nombreAlumno: string;
  vulnerabilidad: Vulnerabilidad;
  areaCanalizacion: AreaCanalizacion;
  fueAtendido: boolean;
  causaNoAtencion?: CausaNoAtencion;
  presentoMejoria: boolean;
  causoBaja: boolean;
  causaBaja?: CausaBaja;
  tutoriaId: number;
}

// Respuestas de la API
export interface TutoriasResponse {
  data: Tutoria[];
}

export interface TutoriaResponse {
  data: Tutoria;
}
