import type { CreateSeguimientoCursoDto, SeguimientoCurso } from "../index";

export interface CreateSeguimientoCursoRequest {
  data: CreateSeguimientoCursoDto;
}

export interface CreateSeguimientoCursoResponse {
  data: SeguimientoCurso;
  message: string;
}
