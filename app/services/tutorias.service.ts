import { API_BASE_URL } from "./api-config";
import type {
  TutoriasResponse,
  TutoriaResponse,
  CreateTutoriaDto,
  CreateTutoriaDetalleDto,
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

  // Obtener tutorías por grupo
  async getByGrupo(grupoId: string, token: string): Promise<TutoriasResponse> {
    const response = await fetch(
      `${API_BASE_URL}${BASE_URL}/grupo/${grupoId}`,
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
        `Error al obtener tutorías del grupo: ${response.statusText}`
      );
    }

    return response.json();
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
