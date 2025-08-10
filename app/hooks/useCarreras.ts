import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getCarrerasDisponibles } from "~/services/grupos";
import { useAuthStore } from "~/store/auth";
import type { CarreraDisponible } from "~/types/grupos";

export function useCarreras() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [carreras, setCarreras] = useState<CarreraDisponible[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarreras = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log(
        "Fetching carreras with token:",
        accessToken ? "Token exists" : "No token"
      );

      const response = await getCarrerasDisponibles({
        token: accessToken,
      });

      console.log("Carreras response:", response);
      setCarreras(response.data); // En lugar de response.data.data
    } catch (err) {
      console.error("Error fetching carreras:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar carreras";
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
  }, [accessToken, navigate]);

  useEffect(() => {
    fetchCarreras();
  }, [fetchCarreras]);

  return {
    carreras,
    isLoading,
    error,
    refetch: fetchCarreras,
  };
}
