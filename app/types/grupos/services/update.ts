export interface UpdateGrupoRequest {
  token: string;
  id: string;
  carrera?: string;
  cuatrimestre?: number;
  numeroGrupo?: number;
  cuatrimestreId?: string;
}

export interface UpdateGrupoResponse {
  id: string;
  carrera: string;
  cuatrimestre: number;
  numeroGrupo: number;
  nombreGenerado: string;
  activo: boolean;
  cuatrimestreId: string;
  createdAt: string;
  updatedAt: string;
}