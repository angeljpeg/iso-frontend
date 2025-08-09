export interface CreateCuatrimestreRequest {
  fechaInicio: string; // formato YYYY-MM-DD
  fechaFin: string; // formato YYYY-MM-DD
  token: string;
}

export interface CreateCuatrimestreResponse {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombreGenerado: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}