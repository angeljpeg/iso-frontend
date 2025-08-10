import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth";
import { getSeguimientosByCargaAcademica } from "~/services/programacion-curso.service";
import type { SeguimientoCurso } from "~/types/programacion-curso";

interface UseSeguimientosByCargaAcademicaOptions {
  cargaAcademicaId?: string;
  autoFetch?: boolean;
}

export function useSeguimientosByCargaAcademica(
  initialOptions: UseSeguimientosByCargaAcademicaOptions = {}
) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [seguimientos, setSeguimientos] = useState<SeguimientoCurso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] =
    useState<UseSeguimientosByCargaAcademicaOptions>({
      autoFetch: true,
      ...initialOptions,
    });

  // Memoizar las options para evitar re-renders innecesarios
  const memoizedOptions = useMemo(() => options, [options.cargaAcademicaId]);
  console.log("memoizedOptions: ", memoizedOptions);

  const fetchSeguimientos = useCallback(async () => {
    console.log("🔍 fetchSeguimientos iniciado");
    console.log("🔍 accessToken:", accessToken ? "✅ Presente" : "❌ Ausente");
    console.log("🔍 cargaAcademicaId:", memoizedOptions.cargaAcademicaId);

    if (!accessToken) {
      console.log("❌ No hay token de autenticación");
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    if (!memoizedOptions.cargaAcademicaId) {
      console.log("❌ Se requiere ID de la carga académica");
      setError("Se requiere ID de la carga académica");
      return;
    }

    try {
      console.log("🚀 Iniciando petición a la API...");
      setIsLoading(true);
      setError(null);

      const requestData = {
        token: accessToken,
        cargaAcademicaId: memoizedOptions.cargaAcademicaId,
      };
      console.log("📤 Datos de la petición:", requestData);

      const response = await getSeguimientosByCargaAcademica(requestData);

      console.log("📥 Respuesta recibida:", response);
      console.log("📥 Cantidad de seguimientos:", response.length);

      // La respuesta es directamente un array
      setSeguimientos(response);
      console.log("✅ Seguimientos actualizados en el estado");
    } catch (err) {
      console.log("❌ Error en fetchSeguimientos:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar seguimientos de la carga académica";
      console.log("❌ Mensaje de error:", errorMessage);
      setError(errorMessage);

      if (
        errorMessage.includes("Sesión expirada") ||
        errorMessage.includes("No hay token")
      ) {
        navigate("/login");
      }
    } finally {
      console.log("🏁 Finalizando fetchSeguimientos");
      setIsLoading(false);
    }
  }, [accessToken, navigate, memoizedOptions.cargaAcademicaId]);

  const updateOptions = useCallback(
    (newOptions: Partial<UseSeguimientosByCargaAcademicaOptions>) => {
      setOptions((prev) => ({
        ...prev,
        ...newOptions,
      }));
    },
    []
  );

  const refresh = useCallback(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch cuando cambien las options
  useEffect(() => {
    console.log("🔄 useEffect autoFetch ejecutándose");
    console.log("🔄 options:", options);
    console.log("🔄 options.autoFetch:", options.autoFetch);
    console.log("🔄 options.cargaAcademicaId:", options.cargaAcademicaId);

    if (options.autoFetch && options.cargaAcademicaId) {
      console.log(
        "✅ Ejecutando fetchSeguimientos con cargaAcademicaId:",
        options.cargaAcademicaId
      );
      fetchSeguimientos();
    } else if (!options.cargaAcademicaId) {
      // Si no hay cargaAcademicaId, no estamos cargando y limpiamos datos
      console.log("❌ No hay cargaAcademicaId, limpiando datos");
      setIsLoading(false);
      setSeguimientos([]);
      setError(null);
    } else {
      console.log("⚠️ Condiciones no cumplidas para autoFetch");
    }
  }, [fetchSeguimientos, options.autoFetch, options.cargaAcademicaId]);

  // Actualizar las options cuando cambie cargaAcademicaId externamente
  useEffect(() => {
    if (initialOptions.cargaAcademicaId !== options.cargaAcademicaId) {
      console.log(
        "Actualizando options con nuevo cargaAcademicaId:",
        initialOptions.cargaAcademicaId
      );
      setOptions((prev) => ({
        ...prev,
        cargaAcademicaId: initialOptions.cargaAcademicaId,
      }));
    }
  }, [initialOptions.cargaAcademicaId, options.cargaAcademicaId]);

  return {
    seguimientos,
    isLoading,
    error,
    options,
    updateOptions,
    refresh,
    clearError,
    fetchSeguimientos,
  };
}
