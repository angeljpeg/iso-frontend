import type { Cuatrimestre, CuatrimestreEstadoType } from "../index";

export interface GetOneCuatrimestreRequest {
  id: string;
  token: string;
}

export interface GetOneCuatrimestreResponse extends Cuatrimestre {
  estado: CuatrimestreEstadoType;
}
