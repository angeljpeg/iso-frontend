export interface CreateEstadiaRequest {
  profesorId: string;
  periodo: string;
  observacionesGenerales?: string;
  token: string;
}

export interface CreateEstadiaResponse {
  id: string;
  profesorId: string;
  periodo: string;
  observacionesGenerales?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
