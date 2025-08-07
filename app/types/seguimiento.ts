export type EstadoSeguimiento =
  | "borrador"
  | "enviado"
  | "revisado"
  | "aprobado"
  | "rechazado";

export type NivelRetraso =
  | "sin_retraso" // Verde
  | "retraso_leve" // Amarillo (1 semana)
  | "retraso_critico"; // Rojo (≥2 semanas)

export interface AvanceSemana {
  id?: string;
  semana: number;
  temaEsperado: string;
  avanceLogrado: string;
  observaciones?: string;
  nivelRetraso: NivelRetraso;
  justificacionRetraso?: string;
  fechaRegistro?: Date;
  fechaActualizacion?: Date;
}

export interface Seguimiento {
  id?: string;
  profesorId: string;
  grupoId: string;
  asignaturaId: string;
  cuatrimestreId: string;
  estado: EstadoSeguimiento;
  avancesSemanales: AvanceSemana[];
  comentariosRevisor?: string;
  fechaCreacion?: Date;
  fechaEnvio?: Date;
  fechaRevision?: Date;
  fechaActualizacion?: Date;

  // Relaciones (opcionales, para cuando se cargan desde la API)
  profesor?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  grupo?: {
    id: string;
    nombreGenerado: string;
    carrera: string;
  };
  asignatura?: {
    id: string;
    nombre: string;
    carrera: string;
  };
  cuatrimestre?: {
    id: string;
    nombreGenerado: string;
  };
}

export interface FiltroSeguimiento {
  profesorId?: string;
  grupoId?: string;
  asignaturaId?: string;
  cuatrimestreId?: string;
  estado?: EstadoSeguimiento;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface EstadisticasSeguimiento {
  totalSeguimientos: number;
  seguimientosPendientes: number;
  seguimientosAprobados: number;
  seguimientosRechazados: number;
  retrasosCriticos: number;
  retrasosLeves: number;
  sinRetrasos: number;
}

export interface NotificacionSeguimiento {
  id: string;
  tipo:
    | "seguimiento_pendiente"
    | "seguimiento_aprobado"
    | "seguimiento_rechazado"
    | "retraso_critico";
  mensaje: string;
  seguimientoId?: string;
  leida: boolean;
  fechaCreacion: Date;
}
