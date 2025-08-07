import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { seguimientoService } from "../services/seguimiento";
import type { Seguimiento } from "../types/seguimiento";

export function useSeguimiento() {
  const navigate = useNavigate();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeguimientos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await seguimientoService.getMisSeguimientos();
      setSeguimientos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los seguimientos";
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
  }, [navigate]);

  const crearSeguimiento = useCallback(
    async (seguimiento: Omit<Seguimiento, "id">) => {
      try {
        const nuevoSeguimiento = await seguimientoService.crearSeguimiento(
          seguimiento
        );
        setSeguimientos((prev) => [...prev, nuevoSeguimiento]);
        return nuevoSeguimiento;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear el seguimiento";
        throw new Error(errorMessage);
      }
    },
    []
  );

  const actualizarSeguimiento = useCallback(
    async (id: string, datos: Partial<Seguimiento>) => {
      try {
        const seguimientoActualizado =
          await seguimientoService.actualizarSeguimiento(id, datos);
        setSeguimientos((prev) =>
          prev.map((seg) => (seg.id === id ? seguimientoActualizado : seg))
        );
        return seguimientoActualizado;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar el seguimiento";
        throw new Error(errorMessage);
      }
    },
    []
  );

  const enviarSeguimiento = useCallback(async (id: string) => {
    try {
      const seguimientoEnviado = await seguimientoService.enviarSeguimiento(id);
      setSeguimientos((prev) =>
        prev.map((seg) => (seg.id === id ? seguimientoEnviado : seg))
      );
      return seguimientoEnviado;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al enviar el seguimiento";
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  return {
    seguimientos,
    isLoading,
    error,
    refetch: fetchSeguimientos,
    crearSeguimiento,
    actualizarSeguimiento,
    enviarSeguimiento,
  };
}
