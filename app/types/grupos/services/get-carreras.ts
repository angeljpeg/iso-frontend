export interface GetCarrerasDisponiblesRequest {
  token: string;
}

export interface CarreraDisponible {
  nombre: string;
  codigo: string;
}

export interface GetCarrerasDisponiblesResponse {
  data: CarreraDisponible[];
}