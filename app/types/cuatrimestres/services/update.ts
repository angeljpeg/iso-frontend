export interface UpdateCuatrimestreRequest {
  id: string;
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  token: string;
}

export interface UpdateCuatrimestreResponse {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombreGenerado: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
