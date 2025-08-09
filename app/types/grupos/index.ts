import type { Cuatrimestre } from "../cuatrimestres";

export interface Grupo {
  id: string;
  carrera: string;
  cuatrimestre: number;
  numeroGrupo: number;
  nombreGenerado: string;
  activo: boolean;
  cuatrimestreId: string;
  cuatrimestreRelacion: Cuatrimestre;
  createdAt: string;
  updatedAt: string;
}

export * from "./services";
