import { type MesType, type AvanceAlumnoType } from "../index";

export interface CreateProgresoRequest {
  token: string;
  estadiaAlumnoId: string;
  mes: MesType;
  avance?: AvanceAlumnoType;
  accionesTomadas?: string;
  fechaEvaluacion?: string;
  observaciones?: string;
}

export interface CreateProgresoResponse {
  id: string;
  estadiaAlumnoId: string;
  mes: MesType;
  avance: AvanceAlumnoType | null;
  accionesTomadas: string | null;
  fechaEvaluacion: string | null;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
}