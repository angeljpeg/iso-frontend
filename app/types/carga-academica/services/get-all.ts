import { type CargaAcademica } from "../index";

export interface GetAllCargaAcademicaRequest {
  token: string;
  profesorId?: string;
  cuatrimestreId?: string;
  grupoId?: string;
  carrera?: string;
  asignatura?: string;
  activo?: string;
  actual?: string;
  esTutor?: string;
  page?: string;
  limit?: string;
}

export interface GetAllCargaAcademicaResponse {
  data: CargaAcademica[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
