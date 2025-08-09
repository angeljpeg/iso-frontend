export interface CreateEstadiaRequest {
  token: string;
  periodo: string;
  observacionesGenerales?: string;
}

export interface CreateEstadiaResponse {
  id: string;
  profesorId: string;
  periodo: string;
  observacionesGenerales: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}