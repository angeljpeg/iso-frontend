import { apiClient } from './auth';
import {
  Estadia,
  EstadiaAlumno,
  ProgresoMensual,
  CreateEstadiaDto,
  UpdateEstadiaDto,
  CreateEstadiaAlumnoDto,
  UpdateEstadiaAlumnoDto,
  CreateProgresoMensualDto,
  UpdateProgresoMensualDto,
  ReporteEstadia,
} from '../types/estadias';

// Servicio para Estadías
export const estadiasService = {
  // Obtener todas las estadías (para coordinadores/moderadores)
  async getAll(): Promise<Estadia[]> {
    const response = await apiClient.get('/estadias');
    return response.data;
  },

  // Obtener estadías del profesor autenticado
  async getByProfesor(): Promise<Estadia[]> {
    const response = await apiClient.get('/estadias/profesor');
    return response.data;
  },

  // Obtener una estadía específica
  async getById(id: string): Promise<Estadia> {
    const response = await apiClient.get(`/estadias/${id}`);
    return response.data;
  },

  // Crear nueva estadía
  async create(data: CreateEstadiaDto): Promise<Estadia> {
    const response = await apiClient.post('/estadias', data);
    return response.data;
  },

  // Actualizar estadía
  async update(id: string, data: UpdateEstadiaDto): Promise<Estadia> {
    const response = await apiClient.patch(`/estadias/${id}`, data);
    return response.data;
  },

  // Eliminar estadía
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/estadias/${id}`);
  },

  // Obtener reporte completo de una estadía
  async getReporte(id: string): Promise<ReporteEstadia> {
    const response = await apiClient.get(`/estadias/reporte/${id}`);
    return response.data;
  },
};

// Servicio para Alumnos de Estadía
export const estadiaAlumnosService = {
  // Obtener todos los alumnos (para coordinadores/moderadores)
  async getAll(): Promise<EstadiaAlumno[]> {
    const response = await apiClient.get('/estadias/alumnos/all');
    return response.data;
  },

  // Obtener alumnos de una estadía específica
  async getByEstadia(estadiaId: string): Promise<EstadiaAlumno[]> {
    const response = await apiClient.get(`/estadias/alumnos/estadia/${estadiaId}`);
    return response.data;
  },

  // Obtener un alumno específico
  async getById(id: string): Promise<EstadiaAlumno> {
    const response = await apiClient.get(`/estadias/alumnos/${id}`);
    return response.data;
  },

  // Crear nuevo alumno
  async create(data: CreateEstadiaAlumnoDto): Promise<EstadiaAlumno> {
    const response = await apiClient.post('/estadias/alumnos', data);
    return response.data;
  },

  // Actualizar alumno
  async update(id: string, data: UpdateEstadiaAlumnoDto): Promise<EstadiaAlumno> {
    const response = await apiClient.patch(`/estadias/alumnos/${id}`, data);
    return response.data;
  },

  // Eliminar alumno
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/estadias/alumnos/${id}`);
  },
};

// Servicio para Progreso Mensual
export const progresoMensualService = {
  // Obtener progreso de un alumno
  async getByAlumno(estadiaAlumnoId: string): Promise<ProgresoMensual[]> {
    const response = await apiClient.get(`/estadias/progreso/alumno/${estadiaAlumnoId}`);
    return response.data;
  },

  // Obtener un progreso específico
  async getById(id: string): Promise<ProgresoMensual> {
    const response = await apiClient.get(`/estadias/progreso/${id}`);
    return response.data;
  },

  // Crear nuevo progreso
  async create(data: CreateProgresoMensualDto): Promise<ProgresoMensual> {
    const response = await apiClient.post('/estadias/progreso', data);
    return response.data;
  },

  // Actualizar progreso
  async update(id: string, data: UpdateProgresoMensualDto): Promise<ProgresoMensual> {
    const response = await apiClient.patch(`/estadias/progreso/${id}`, data);
    return response.data;
  },

  // Eliminar progreso
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/estadias/progreso/${id}`);
  },
};
