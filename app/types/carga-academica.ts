// Enum para roles de usuario
export enum RolUsuario {
  COORDINADOR = "coordinador",
  MODERADOR = "moderador",
  PROFESOR_TIEMPO_COMPLETO = "profesor_tiempo_completo",
  PROFESOR_ASIGNATURA = "profesor_asignatura",
}

// Usuario/Profesor interface
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  activo: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Las asignaturas y temas son datos estáticos en el backend, no entidades de BD
export interface Asignatura {
  nombre: string;
  horasProgramadas: number;
  temas: Tema[];
}

export interface Tema {
  nombre: string;
  unidad: number;
  semanaProgramada: number;
}

export interface Cuatrimestre {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombreGenerado: string;
  grupos: Grupo[];
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grupo {
  id: string;
  carrera: string;
  cuatrimestre: number;
  numeroGrupo: number;
  nombreGenerado: string;
  cuatrimestreId: string;
  activo: boolean;
  cuatrimestreRelacion: Cuatrimestre;
  createdAt: Date;
  updatedAt: Date;
}

// CargaAcademica actualizada según la entidad del backend
export interface CargaAcademica {
  id: string;
  profesorId: string;
  carrera: string; // Es un string, no una relación
  asignatura: string; // Es un string, no una relación
  grupoId: string;
  cuatrimestreId: string;
  activo: boolean;
  // Relaciones eager
  profesor: Usuario; // Relación con Usuario, no solo ID
  grupo: Grupo; // Relación con Grupo
  createdAt: Date;
  updatedAt: Date;
}
