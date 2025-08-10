import type { CreateSeguimientoCursoDto, SeguimientoCurso } from "../index";

export interface CreateSeguimientoCursoRequest {
  token: string;
  data: CreateSeguimientoCursoDto;
}

export interface CreateSeguimientoCursoResponse {
  data: SeguimientoCurso;
  message: string;
}
