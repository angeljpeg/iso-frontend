import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "../lib/validations";
import { authService } from "../services/auth";
import { useAuthStore } from "../store/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(data);
      login(response);

      // Redirigir al dashboard después del login exitoso
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: useAuthStore((state) => state.isLoading),
  };
};
