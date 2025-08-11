import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { seguimientoService } from "../services/seguimiento";
import type { Seguimiento, AvanceSemana } from "../types/seguimiento";

export function useSeguimientoIndividual(seguimientoId?: string) {
  const navigate = useNavigate();
  const [seguimiento, setSeguimiento] = useState<Seguimiento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Para autoguardado
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>("");
  
  // Limpiar estado cuando cambie el seguimientoId
  useEffect(() => {
    if (seguimientoId) {
      // Solo limpiar si es un ID diferente
      if (seguimiento?.id !== seguimientoId) {
        setSeguimiento(null);
        setError(null);
        setHasUnsavedChanges(false);
        lastSavedDataRef.current = "";
      }
    } else {
      // Si no hay seguimientoId, limpiar todo
      setSeguimiento(null);
      setError(null);
      setHasUnsavedChanges(false);
      lastSavedDataRef.current = "";
      setIsLoading(false);
    }
  }, [seguimientoId, seguimiento?.id]);

  const fetchSeguimiento = useCallback(async () => {
    if (!seguimientoId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await seguimientoService.getSeguimiento(seguimientoId);
      setSeguimiento(data);
      lastSavedDataRef.current = JSON.stringify(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar el seguimiento";
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [seguimientoId, navigate]);

  const actualizarSeguimiento = useCallback(
    async (datos: Partial<Seguimiento>) => {
      if (!seguimiento?.id) return;

      try {
        setIsSaving(true);
        const seguimientoActualizado =
          await seguimientoService.actualizarSeguimiento(seguimiento.id, datos);
        setSeguimiento(seguimientoActualizado);
        lastSavedDataRef.current = JSON.stringify(seguimientoActualizado);
        setHasUnsavedChanges(false);
        return seguimientoActualizado;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar el seguimiento";
        throw new Error(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [seguimiento?.id]
  );

  const actualizarAvanceSemana = useCallback(
    (semana: number, avance: Partial<AvanceSemana>) => {
      if (!seguimiento) return;

      const nuevosAvances = seguimiento.avancesSemanales.map((av) =>
        av.semana === semana ? { ...av, ...avance } : av
      );

      const seguimientoActualizado = {
        ...seguimiento,
        avancesSemanales: nuevosAvances,
      };

      setSeguimiento(seguimientoActualizado);
      setHasUnsavedChanges(true);

      // Autoguardado después de 3 segundos de inactividad
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        actualizarSeguimiento(seguimientoActualizado);
      }, 3000);
    },
    [seguimiento, actualizarSeguimiento]
  );

  const enviarSeguimiento = useCallback(async () => {
    if (!seguimiento?.id) return;

    try {
      setIsSaving(true);
      const seguimientoEnviado = await seguimientoService.enviarSeguimiento(
        seguimiento.id
      );
      setSeguimiento(seguimientoEnviado);
      setHasUnsavedChanges(false);
      return seguimientoEnviado;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al enviar el seguimiento";
      throw new Error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [seguimiento?.id]);

  const guardarManual = useCallback(async () => {
    if (!seguimiento) return;
    await actualizarSeguimiento(seguimiento);
  }, [seguimiento, actualizarSeguimiento]);

  const limpiarEstado = useCallback(() => {
    setSeguimiento(null);
    setError(null);
    setHasUnsavedChanges(false);
    setSeguimiento(null);
    lastSavedDataRef.current = "";
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchSeguimiento();
  }, [fetchSeguimiento]);

  return {
    seguimiento,
    isLoading,
    error,
    isSaving,
    hasUnsavedChanges,
    refetch: fetchSeguimiento,
    actualizarSeguimiento,
    actualizarAvanceSemana,
    enviarSeguimiento,
    guardarManual,
    limpiarEstado,
  };
}
