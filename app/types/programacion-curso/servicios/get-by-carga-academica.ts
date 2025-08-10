import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosByCargaAcademicaRequest {
  token: string;
  cargaAcademicaId: string;
}

export interface GetSeguimientosByCargaAcademicaResponse extends Array<SeguimientoCurso> {}
