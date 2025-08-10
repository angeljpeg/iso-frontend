import type { SeguimientoCurso } from "../index";

export interface GetSeguimientoCursoByIdRequest {
  token: string;
  id: string;
}

export interface GetSeguimientoCursoByIdResponse {
  data: SeguimientoCurso;
}
