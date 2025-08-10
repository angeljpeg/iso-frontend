import type { UpdateSeguimientoCursoDto, SeguimientoCurso } from "../index";

export interface UpdateSeguimientoCursoRequest {
  token: string;
  id: string;
  data: UpdateSeguimientoCursoDto;
}

export interface UpdateSeguimientoCursoResponse {
  data: SeguimientoCurso;
  message: string;
}
