export interface ReactivateGrupoRequest {
  token: string;
  id: string;
}

export interface ReactivateGrupoResponse {
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