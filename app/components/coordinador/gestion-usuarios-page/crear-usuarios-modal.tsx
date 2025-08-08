import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { RolUsuarioEnum } from "~/types/usuarios";
import type { CreateUsuarioRequest } from "~/types/usuarios/services/create";
import { createUsuario } from "~/services/coordinadores/usuarios.service";
import { useAuthStore } from "~/store/auth";

// Schema de validación con Zod
const createUsuarioSchema = z
  .object({
    email: z
      .email("Debe ser un email válido")
      .min(1, "El email es requerido")
      .max(255, "El email no puede exceder 255 caracteres"),
    nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres"),
    apellido: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres"),
    rol: z.enum(RolUsuarioEnum).default(RolUsuarioEnum.PROFESOR_ASIGNATURA),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string().min(1, "Confirme la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type CreateUsuarioFormData = z.infer<typeof createUsuarioSchema>;

interface CrearUsuariosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CrearUsuariosModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CrearUsuariosModalProps) => {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUsuarioFormData>({
    resolver: zodResolver(
      createUsuarioSchema
    ) as Resolver<CreateUsuarioFormData>,
    defaultValues: {
      email: "",
      nombre: "",
      apellido: "",
      rol: RolUsuarioEnum.PROFESOR_ASIGNATURA,
      password: "",
      confirmPassword: "",
    },
  });

  const rolOptions = [
    {
      value: RolUsuarioEnum.COORDINADOR,
      label: "Coordinador",
    },
    {
      value: RolUsuarioEnum.MODERADOR,
      label: "Moderador",
    },
    {
      value: RolUsuarioEnum.PROFESOR_TIEMPO_COMPLETO,
      label: "Profesor Tiempo Completo",
    },
    {
      value: RolUsuarioEnum.PROFESOR_ASIGNATURA,
      label: "Profesor Asignatura",
    },
  ];

  const onSubmit = async (data: CreateUsuarioFormData) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    setIsLoading(true);

    try {
      const createRequest: CreateUsuarioRequest = {
        token: accessToken,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        password: data.password,
      };

      await createUsuario(createRequest);

      toast.success("Usuario creado exitosamente");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear usuario";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete los datos para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el apellido"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol *</FormLabel>
                  <FormControl>
                    <FormSelect
                      options={rolOptions}
                      placeholder="Seleccione un rol"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
