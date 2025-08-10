import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosByCargaAcademicaRequest {
  cargaAcademicaId: string;
}

export interface GetSeguimientosByCargaAcademicaResponse {
  data: SeguimientoCurso[];
}
