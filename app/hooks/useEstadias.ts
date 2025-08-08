import { useState, useEffect, useCallback } from 'react';
import { estadiasService, estadiaAlumnosService, progresoMensualService } from '../services/estadias';
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

export const useEstadias = () => {
  const [estadias, setEstadias] = useState<Estadia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await estadiasService.getByProfesor();
      setEstadias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadías');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEstadia = useCallback(async (data: CreateEstadiaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newEstadia = await estadiasService.create(data);
      setEstadias(prev => [...prev, newEstadia]);
      return newEstadia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear estadía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEstadia = useCallback(async (id: string, data: UpdateEstadiaDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEstadia = await estadiasService.update(id, data);
      setEstadias(prev => prev.map(estadia => 
        estadia.id === id ? updatedEstadia : estadia
      ));
      return updatedEstadia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estadía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEstadia = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await estadiasService.delete(id);
      setEstadias(prev => prev.filter(estadia => estadia.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar estadía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReporteEstadia = useCallback(async (id: string): Promise<ReporteEstadia> => {
    try {
      setLoading(true);
      setError(null);
      return await estadiasService.getReporte(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadias();
  }, [fetchEstadias]);

  return {
    estadias,
    loading,
    error,
    fetchEstadias,
    createEstadia,
    updateEstadia,
    deleteEstadia,
    getReporteEstadia,
  };
};

export const useEstadiaAlumnos = (estadiaId?: string) => {
  const [alumnos, setAlumnos] = useState<EstadiaAlumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumnos = useCallback(async () => {
    if (!estadiaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await estadiaAlumnosService.getByEstadia(estadiaId);
      setAlumnos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  }, [estadiaId]);

  const createAlumno = useCallback(async (data: CreateEstadiaAlumnoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newAlumno = await estadiaAlumnosService.create(data);
      setAlumnos(prev => [...prev, newAlumno]);
      return newAlumno;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear alumno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAlumno = useCallback(async (id: string, data: UpdateEstadiaAlumnoDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAlumno = await estadiaAlumnosService.update(id, data);
      setAlumnos(prev => prev.map(alumno => 
        alumno.id === id ? updatedAlumno : alumno
      ));
      return updatedAlumno;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar alumno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAlumno = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await estadiaAlumnosService.delete(id);
      setAlumnos(prev => prev.filter(alumno => alumno.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar alumno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  return {
    alumnos,
    loading,
    error,
    fetchAlumnos,
    createAlumno,
    updateAlumno,
    deleteAlumno,
  };
};

export const useProgresoMensual = (estadiaAlumnoId?: string) => {
  const [progresos, setProgresos] = useState<ProgresoMensual[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgresos = useCallback(async () => {
    if (!estadiaAlumnoId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await progresoMensualService.getByAlumno(estadiaAlumnoId);
      setProgresos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar progresos');
    } finally {
      setLoading(false);
    }
  }, [estadiaAlumnoId]);

  const createProgreso = useCallback(async (data: CreateProgresoMensualDto) => {
    try {
      setLoading(true);
      setError(null);
      const newProgreso = await progresoMensualService.create(data);
      setProgresos(prev => [...prev, newProgreso]);
      return newProgreso;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear progreso');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgreso = useCallback(async (id: string, data: UpdateProgresoMensualDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProgreso = await progresoMensualService.update(id, data);
      setProgresos(prev => prev.map(progreso => 
        progreso.id === id ? updatedProgreso : progreso
      ));
      return updatedProgreso;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar progreso');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProgreso = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await progresoMensualService.delete(id);
      setProgresos(prev => prev.filter(progreso => progreso.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar progreso');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgresos();
  }, [fetchProgresos]);

  return {
    progresos,
    loading,
    error,
    fetchProgresos,
    createProgreso,
    updateProgreso,
    deleteProgreso,
  };
};
