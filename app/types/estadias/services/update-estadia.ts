export interface UpdateEstadiaRequest {
  token: string;
  id: string;
  periodo?: string;
  observacionesGenerales?: string;
}

export interface UpdateEstadiaResponse {
  id: string;
  profesorId: string;
  periodo: string;
  observacionesGenerales: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}