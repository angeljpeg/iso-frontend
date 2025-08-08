import { API_BASE_URL } from "../api-config";
import type {
  GetAllUsuariosRequest,
  GetAllUsuariosResponse,
} from "~/types/usuarios/services/get-all";

const USUARIOS_URL = `${API_BASE_URL}/usuarios`;

export const getAllUsuarios = async (
  request: GetAllUsuariosRequest
): Promise<GetAllUsuariosResponse> => {
  try {
    const { token, ...rest } = request;
    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${USUARIOS_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching usuarios: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllUsuariosResponse;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
