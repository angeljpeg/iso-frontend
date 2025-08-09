import type { Grupo } from "../grupos";

export const CUATRIMESTRE_ESTADOS = [
  "Próximo",
  "Activo",
  "Finalizado",
] as const;

export enum CuatrimestreEstadoEnum {
  Próximo = "Próximo",
  Activo = "Activo",
  Finalizado = "Finalizado",
}

export type CuatrimestreEstadoType = (typeof CUATRIMESTRE_ESTADOS)[number];

export interface Cuatrimestre {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombreGenerado: string;
  activo: boolean;
  grupos?: Grupo[];
  createdAt: Date;
  updatedAt: Date;
  estado?: "Próximo" | "Activo" | "Finalizado";
}
