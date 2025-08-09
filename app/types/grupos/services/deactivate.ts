export interface DeactivateGrupoRequest {
  token: string;
  id: string;
}

export interface DeactivateGrupoResponse {
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