import type { CreateSeguimientoDetalleDto, SeguimientoDetalle } from "../index";

export interface CreateSeguimientoDetalleRequest {
  data: CreateSeguimientoDetalleDto;
}

export interface CreateSeguimientoDetalleResponse {
  data: SeguimientoDetalle;
  message: string;
}
