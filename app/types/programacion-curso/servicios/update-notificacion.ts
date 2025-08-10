import type { NotificacionSeguimiento } from "../index";

export interface UpdateNotificacionRequest {
  token: string;
  id: string;
  data: Partial<NotificacionSeguimiento>;
}

export interface UpdateNotificacionResponse {
  data: NotificacionSeguimiento;
  message: string;
}
