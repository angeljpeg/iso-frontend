export interface MarcarNotificacionLeidaRequest {
  token: string;
  id: string;
}

export interface MarcarNotificacionLeidaResponse {
  message: string;
  success: boolean;
  fechaLectura: string;
}
