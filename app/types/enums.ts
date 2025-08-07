// Enums para estados de seguimiento
export enum EstadoAvance {
  NO_INICIADO = 'no_iniciado',
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado',
  RETRASADO = 'retrasado',
}

export enum EstadoSeguimiento {
  BORRADOR = 'borrador',
  ENVIADO = 'enviado',
  REVISADO = 'revisado',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

export enum TipoNotificacion {
  FALTA_ACTUALIZACION = 'falta_actualizacion',
  RETRASO_CRITICO = 'retraso_critico',
  COMENTARIO_DIRECTOR = 'comentario_director',
  RECORDATORIO = 'recordatorio',
  MANUAL = 'manual',
}

export enum EstadoNotificacion {
  PENDIENTE = 'pendiente',
  ENVIADA = 'enviada',
  LEIDA = 'leida',
  ERROR = 'error',
}