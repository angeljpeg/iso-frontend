import { type Usuario } from "../usuarios";
export * from "./services";

// Enums basados en las entidades del backend
export const Mes = [1, 2, 3, 4] as const;
export type MesType = (typeof Mes)[number];

export enum MesEnum {
  MES_1 = 1,
  MES_2 = 2,
  MES_3 = 3,
  MES_4 = 4,
}

export const AvanceAlumno = ["si", "no"] as const;
export type AvanceAlumnoType = (typeof AvanceAlumno)[number];

export enum AvanceAlumnoEnum {
  SI = "si",
  NO = "no",
}

// Interfaces principales
export interface Estadia {
  id: string;
  profesorId: string;
  periodo: string;
  observacionesGenerales: string | null;
  activo: boolean;
  profesor: Usuario;
  alumnos: EstadiaAlumno[];
  createdAt: string;
  updatedAt: string;
}

export interface EstadiaAlumno {
  id: string;
  nombreAlumno: string;
  matricula: string | null;
  carrera: string | null;
  estadiaId: string;
  observacionesGenerales: string | null;
  activo: boolean;
  estadia: Estadia;
  progresoMensual: ProgresoMensual[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgresoMensual {
  id: string;
  estadiaAlumnoId: string;
  mes: MesType;
  avance: AvanceAlumnoType | null;
  accionesTomadas: string | null;
  fechaEvaluacion: string | null;
  observaciones: string | null;
  estadiaAlumno: EstadiaAlumno;
  createdAt: string;
  updatedAt: string;
}
