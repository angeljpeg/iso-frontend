import type { CreateSeguimientoDetalleDto, SeguimientoDetalle } from "../index";

export interface CreateSeguimientoDetalleRequest {
  token: string;
  data: CreateSeguimientoDetalleDto;
}

export interface CreateSeguimientoDetalleResponse {
  data: SeguimientoDetalle;
  message: string;
}
