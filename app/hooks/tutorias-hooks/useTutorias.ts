import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { tutoriasService } from "~/services/tutorias.service";
import { useAuthStore } from "~/store/auth";
import type { Tutoria } from "~/types/tutorias";

interface UseTutoriasOptions {
  profesorId?: string;
  periodo?: string;
  carrera?: string;
  onlyMyTutorias?: boolean;
}

export function useTutorias(options: UseTutoriasOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profesorId, periodo, carrera, onlyMyTutorias = false } = options;

  const handleError = useCallback(
    (err: unknown) => {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar tutorías";
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    },
    [navigate]
  );

  const fetchTutorias = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Fetching tutorías...");
      console.log("🔑 Token:", accessToken ? "Presente" : "Ausente");
      console.log("📋 OnlyMyTutorias:", onlyMyTutorias);

      let tutoriasData: Tutoria[];

      if (onlyMyTutorias) {
        // TODO: Implementar endpoint para obtener tutorías del profesor actual
        console.log("🔄 Llamando a getAll para profesor actual...");
        const response = await tutoriasService.getAll(accessToken);
        console.log("📥 Respuesta para profesor:", response);

        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          tutoriasData = response;
        } else if (response && Array.isArray(response.data)) {
          tutoriasData = response.data;
        } else {
          console.warn("⚠️ Estructura de respuesta inesperada:", response);
          tutoriasData = [];
        }
      } else {
        console.log("🔄 Llamando a getAll para todas las tutorías...");
        const response = await tutoriasService.getAll(accessToken);
        console.log("📥 Respuesta para todas:", response);

        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          tutoriasData = response;
        } else if (response && Array.isArray(response.data)) {
          tutoriasData = response.data;
        } else {
          console.warn("⚠️ Estructura de respuesta inesperada:", response);
          tutoriasData = [];
        }
      }

      console.log("📊 Datos finales:", tutoriasData);
      setTutorias(tutoriasData);
    } catch (err) {
      console.error("❌ Error en fetchTutorias:", err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, onlyMyTutorias, navigate, handleError]);

  useEffect(() => {
    fetchTutorias();
  }, [fetchTutorias]);

  const filteredTutorias = useMemo(() => {
    return tutorias.filter((tutoria) => {
      if (profesorId && tutoria.nombreTutor !== profesorId) return false;
      if (periodo && tutoria.cuatrimestre !== periodo) return false;
      if (carrera && tutoria.carrera !== carrera) return false;
      return true;
    });
  }, [tutorias, profesorId, periodo, carrera]);

  const refetch = useCallback(() => {
    fetchTutorias();
  }, [fetchTutorias]);

  return {
    tutorias: filteredTutorias,
    isLoading,
    error,
    refetch,
  };
}
