import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllUsuarios } from "~/services/coordinadores/usuarios.service";
import { useAuthStore } from "~/store/auth";
import type { Usuario, RolUsuario } from "~/types/usuarios";
import type { GetAllUsuariosResponse } from "~/types/usuarios/services/get-all";

interface UseUsuariosOptions {
  rol?: RolUsuario;
  estado?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export function useUsuarios(options: UseUsuariosOptions = {}) {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchUsuarios = useCallback(async () => {
    if (!accessToken) {
      setError("No hay token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response: GetAllUsuariosResponse = await getAllUsuarios({
        token: accessToken,
        ...options,
      });

      setUsuarios(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar usuarios";
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
  }, [accessToken, options, navigate]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    isLoading,
    error,
    pagination,
    refetch: fetchUsuarios,
  };
}
