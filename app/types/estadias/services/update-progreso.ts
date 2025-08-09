import { type MesType, type AvanceAlumnoType } from "../index";

export interface UpdateProgresoRequest {
  token: string;
  id: string;
  mes?: MesType;
  avance?: AvanceAlumnoType;
  accionesTomadas?: string;
  fechaEvaluacion?: string;
  observaciones?: string;
}

export interface UpdateProgresoResponse {
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