import { useState, useEffect } from "react";
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
import type { UpdateUsuarioRequest } from "~/types/usuarios/services/create";
import type { RolUsuarioType, Usuario } from "~/types/usuarios";
import { updateUsuario } from "~/services/coordinadores/usuarios.service";
import { useAuthStore } from "~/store/auth";

// Schema de validación con Zod para edición (sin contraseña)
const updateUsuarioSchema = z.object({
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
});

type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;

interface EditarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onSuccess?: () => void;
}

export const EditarUsuarioModal = ({
  open,
  onOpenChange,
  usuario,
  onSuccess,
}: EditarUsuarioModalProps) => {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateUsuarioFormData>({
    resolver: zodResolver(
      updateUsuarioSchema
    ) as Resolver<UpdateUsuarioFormData>,
    defaultValues: {
      email: "",
      nombre: "",
      apellido: "",
      rol: RolUsuarioEnum.PROFESOR_ASIGNATURA,
    },
  });

  // Actualizar el formulario cuando cambie el usuario
  useEffect(() => {
    if (usuario && open) {
      form.reset({
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol as RolUsuarioEnum,
      });
    }
  }, [usuario, open, form]);

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

  const onSubmit = async (data: UpdateUsuarioFormData) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    if (!usuario) {
      toast.error("No hay usuario seleccionado");
      return;
    }

    setIsLoading(true);

    try {
      const updateRequest: UpdateUsuarioRequest = {
        token: accessToken,
        id: usuario.id,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
      };

      await updateUsuario(updateRequest);

      toast.success("Usuario actualizado exitosamente");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar usuario";
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
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifique los datos del usuario. Los campos marcados con * son
            obligatorios.
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
                {isLoading ? "Actualizando..." : "Actualizar Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
