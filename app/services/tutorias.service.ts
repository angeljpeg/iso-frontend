import { API_BASE_URL } from "./api-config";
import type {
  TutoriasResponse,
  TutoriaResponse,
  CreateTutoriaDto,
  CreateTutoriaDetalleDto,
  Tutoria,
} from "../types/tutorias";

const BASE_URL = "/tutorias";

export const tutoriasService = {
  // Obtener todas las tutorías
  async getAll(token: string): Promise<TutoriasResponse> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener tutorías: ${response.statusText}`);
    }

    return response.json();
  },

  // Obtener tutorías por carga académica
  async getByCargaAcademica(
    cargaAcademicaId: string,
    token: string
  ): Promise<Tutoria[]> {
    const response = await fetch(
      `${API_BASE_URL}${BASE_URL}/carga-academica/${cargaAcademicaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener tutorías de la carga académica: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Tutorías obtenidas:", data);

    return data;
  },

  // Obtener tutorías por grupo (mantener compatibilidad)
  async getByGrupo(grupoId: string, token: string): Promise<TutoriasResponse> {
    console.warn(
      "getByGrupo está deprecado, usa getByCargaAcademica en su lugar"
    );
    throw new Error(
      "Este método está deprecado. Usa getByCargaAcademica con el ID de la carga académica"
    );
  },

  // Obtener una tutoria específica
  async getById(id: number, token: string): Promise<TutoriaResponse> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener la tutoria: ${response.statusText}`);
    }

    return response.json();
  },

  // Crear una nueva tutoria
  async create(
    tutoria: CreateTutoriaDto,
    token: string
  ): Promise<TutoriaResponse> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tutoria),
    });

    if (!response.ok) {
      throw new Error(`Error al crear la tutoria: ${response.statusText}`);
    }

    return response.json();
  },

  // Agregar detalle a una tutoria
  async addDetalle(
    detalle: CreateTutoriaDetalleDto,
    token: string
  ): Promise<TutoriaResponse> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/detalles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(detalle),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar detalle: ${response.statusText}`);
    }

    return response.json();
  },

  // Actualizar una tutoria
  async update(
    id: number,
    tutoria: Partial<CreateTutoriaDto>,
    token: string
  ): Promise<TutoriaResponse> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tutoria),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar la tutoria: ${response.statusText}`);
    }

    return response.json();
  },

  // Eliminar una tutoria
  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar la tutoria: ${response.statusText}`);
    }
  },
};
