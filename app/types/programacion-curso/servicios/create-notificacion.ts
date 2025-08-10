import type { CreateNotificacionDto, NotificacionSeguimiento } from "../index";

export interface CreateNotificacionRequest {
  token: string;
  data: CreateNotificacionDto;
}

export interface CreateNotificacionResponse {
  data: NotificacionSeguimiento;
  message: string;
}
