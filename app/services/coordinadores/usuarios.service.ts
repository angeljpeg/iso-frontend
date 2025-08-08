import type {
  CreateUsuarioRequest,
  CreateUsuarioResponse,
  UpdateUsuarioRequest,
  UpdateUsuarioResponse,
} from "~/types/usuarios/services";
import { API_BASE_URL } from "../api-config";
import type {
  GetAllUsuariosRequest,
  GetAllUsuariosResponse,
} from "~/types/usuarios/services/get-all";
import type {
  DeactivateUsuarioRequest,
  ReactivateUsuarioRequest,
} from "~/types/usuarios/services/delete";

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
    console.log(params.toString());

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

export const createUsuario = async (
  request: CreateUsuarioRequest
): Promise<CreateUsuarioResponse> => {
  try {
    const { token, ...userData } = request;

    const response = await fetch(`${USUARIOS_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating usuario: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateUsuarioResponse;
  } catch (error) {
    console.error("Error creating usuario:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

export const updateUsuario = async (
  request: UpdateUsuarioRequest
): Promise<UpdateUsuarioResponse> => {
  try {
    const { token, id, ...userData } = request;

    const response = await fetch(`${USUARIOS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating usuario: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateUsuarioResponse;
  } catch (error) {
    console.error("Error updating usuario:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

export const deactivateUsuario = async (
  request: DeactivateUsuarioRequest
): Promise<void> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${USUARIOS_URL}/${id}/deactivate`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deactivating usuario: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }
  } catch (error) {
    console.error("Error deactivating usuario:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

export const reactivateUsuario = async (
  request: ReactivateUsuarioRequest
): Promise<void> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${USUARIOS_URL}/${id}/reactivate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error reactivating usuario: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }
  } catch (error) {
    console.error("Error reactivating usuario:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
