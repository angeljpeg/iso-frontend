import type {
  GetAllCuatrimestresRequest,
  GetAllCuatrimestresResponse,
} from "~/types/cuatrimestres/services/get-all";
import { API_BASE_URL } from "./api-config";

const CUATRIMESTRES_URL = `${API_BASE_URL}/cuatrimestres`;

// Obtener todos los cuatrimestres
export const getAllCuatrimestres = async (
  request: GetAllCuatrimestresRequest
): Promise<GetAllCuatrimestresResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${CUATRIMESTRES_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching cuatrimestres: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllCuatrimestresResponse;
  } catch (error) {
    console.error("Error fetching cuatrimestres:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};