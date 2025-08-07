export interface Asignatura {
  id: string;
  nombre: string;
  carrera: string;
  activo: boolean;
  temas: Tema[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tema {
  id: string;
  nombre: string;
  unidad: number;
  descripcion?: string;
  semanaRecomendada: number;
  horasProgramadas?: number;
  asignaturaId: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface CargaAcademica {
  id: string;
  profesorId: string;
  asignaturaId: string;
  grupoId: string;
  cuatrimestreId: string;
  activo: boolean;
  asignatura: Asignatura;
  grupo: Grupo;
  createdAt: Date;
  updatedAt: Date;
}
