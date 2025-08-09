export interface CreateGrupoRequest {
  token: string;
  carrera: string;
  cuatrimestre: number;
  numeroGrupo: number;
  cuatrimestreId: string;
}

export interface CreateGrupoResponse {
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