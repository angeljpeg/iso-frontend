import type { SeguimientoCurso } from "../index";

export interface GetSeguimientoCursoByIdRequest {
  id: string;
}

export interface GetSeguimientoCursoByIdResponse {
  data: SeguimientoCurso;
}
