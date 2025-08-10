import type { Usuario } from "../usuarios";
import type { CargaAcademica } from "../carga-academica";
import type { Cuatrimestre } from "../cuatrimestres";

export * from "./servicios";

// Enums basados en las entidades del backend
export enum EstadoSeguimiento {
  BORRADOR = "borrador",
  ENVIADO = "enviado",
  REVISADO = "revisado",
  APROBADO = "aprobado",
  RECHAZADO = "rechazado",
}

export enum EstadoAvance {
  NO_INICIADO = "no_iniciado",
  EN_PROGRESO = "en_progreso",
  COMPLETADO = "completado",
  RETRASADO = "retrasado",
}

export enum TipoNotificacion {
  FALTA_ACTUALIZACION = "falta_actualizacion",
  RETRASO_CRITICO = "retraso_critico",
  COMENTARIO_DIRECTOR = "comentario_director",
  RECORDATORIO = "recordatorio",
  MANUAL = "manual",
}

export enum EstadoNotificacion {
  PENDIENTE = "pendiente",
  ENVIADA = "enviada",
  LEIDA = "leida",
  ERROR = "error",
}

// Interfaces principales
export interface SeguimientoCurso {
  id: string;
  cargaAcademicaId: string;
  estado: EstadoSeguimiento;
  revisadoPorId: string | null;
  fechaEntregado: string | null;
  fechaRevision: string | null;
  fechaSeguimientoFinal: string | null;
  numeroRevision: number;
  cargaAcademica: CargaAcademica;
  cuatrimestre: Cuatrimestre;
  revisadoPor: Usuario | null;
  detalles: SeguimientoDetalle[];
  createdAt: string;
  updatedAt: string;
}

export interface SeguimientoDetalle {
  id: string;
  tema: string;
  semanaTerminada: number;
  estadoAvance: EstadoAvance;
  observaciones: string | null;
  justificacion: string | null;
  acciones: string | null;
  evidencias: string | null;
  retraso: boolean;
  seguimientoCursoId: string;
  seguimientoCurso: SeguimientoCurso;
  createdAt: string;
  updatedAt: string;
}

export interface NotificacionSeguimiento {
  id: string;
  usuarioId: string;
  seguimientoCursoId: string | null;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  estado: EstadoNotificacion;
  fechaEnvio: string | null;
  fechaLectura: string | null;
  metadatos: any;
  usuario: Usuario;
  seguimientoCurso: SeguimientoCurso | null;
  createdAt: string;
  updatedAt: string;
}

// Tipos para formularios y creación
export interface CreateSeguimientoCursoDto {
  cargaAcademicaId: string;
  cuatrimestreId: string;
  fechaRevision?: string;
}

export interface CreateSeguimientoDetalleDto {
  tema: string;
  semanaTerminada: number;
  seguimientoCursoId: string;
  estadoAvance: EstadoAvance;
  justificacion?: string;
  acciones?: string;
  evidencias?: string;
}

export interface CreateNotificacionDto {
  usuarioId: string;
  seguimientoCursoId?: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  metadatos?: any;
}

// Tipos para actualización
export interface UpdateSeguimientoCursoDto {
  estado?: EstadoSeguimiento;
  fechaRevision?: string;
  fechaSeguimientoFinal?: string;
  numeroRevision?: number;
}

export interface UpdateSeguimientoDetalleDto {
  tema?: string;
  semanaTerminada?: number;
  estadoAvance?: EstadoAvance;
  observaciones?: string;
  justificacion?: string;
  acciones?: string;
  evidencias?: string;
  retraso?: boolean;
}
