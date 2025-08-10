import type { UpdateSeguimientoCursoDto, SeguimientoCurso } from "../index";

export interface UpdateSeguimientoCursoRequest {
  id: string;
  data: UpdateSeguimientoCursoDto;
}

export interface UpdateSeguimientoCursoResponse {
  data: SeguimientoCurso;
  message: string;
}
