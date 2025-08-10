import type { SeguimientoDetalle } from "../index";

export interface GetSeguimientoDetallesRequest {
  seguimientoCursoId: string;
}

export interface GetSeguimientoDetallesResponse {
  data: SeguimientoDetalle[];
  total: number;
}
