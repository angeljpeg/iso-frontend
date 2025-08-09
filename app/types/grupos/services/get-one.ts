import { type Grupo } from "../index";

export interface GetOneGrupoRequest {
  token: string;
  id: string;
}

export interface GetOneGrupoResponse extends Grupo {}
