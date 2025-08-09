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
import type { CreateCargaAcademicaRequest } from "~/types/carga-academica/services/create";
import { createCargaAcademica } from "~/services/coordinadores/carga-academica.service";
import { useAuthStore } from "~/store/auth";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useGrupos } from "~/hooks/useGrupos";
import { RolUsuarioEnum } from "~/types/usuarios";

// Schema de validación con Zod
const createCargaAcademicaSchema = z.object({
  profesorId: z.string().min(1, "El profesor es requerido"),
  carrera: z
    .string()
    .min(2, "La carrera debe tener al menos 2 caracteres")
    .max(100, "La carrera no puede exceder 100 caracteres"),
  asignatura: z
    .string()
    .min(2, "La asignatura debe tener al menos 2 caracteres")
    .max(100, "La asignatura no puede exceder 100 caracteres"),
  grupoId: z.string().min(1, "El grupo es requerido"),
});

type CreateCargaAcademicaFormData = z.infer<typeof createCargaAcademicaSchema>;

interface CrearCargaAcademicaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CrearCargaAcademicaModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CrearCargaAcademicaModalProps) => {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para obtener profesores y grupos
  const { usuarios: profesores } = useUsuarios({
    rol: RolUsuarioEnum.PROFESOR_TIEMPO_COMPLETO,
    activo: true,
    limit: 100, // Obtener todos los profesores activos
  });

  const { usuarios: profesoresAsignatura } = useUsuarios({
    rol: RolUsuarioEnum.PROFESOR_ASIGNATURA,
    activo: true,
    limit: 100,
  });

  const { grupos } = useGrupos({
    activo: true,
    limit: 100, // Obtener todos los grupos activos
  });

  const form = useForm<CreateCargaAcademicaFormData>({
    resolver: zodResolver(
      createCargaAcademicaSchema
    ) as Resolver<CreateCargaAcademicaFormData>,
    defaultValues: {
      profesorId: "",
      carrera: "",
      asignatura: "",
      grupoId: "",
    },
  });

  // Combinar profesores de tiempo completo y asignatura
  const todosProfesores = [...profesores, ...profesoresAsignatura];

  const profesorOptions = todosProfesores.map((profesor) => ({
    value: profesor.id,
    label: `${profesor.nombre} ${profesor.apellido}`,
  }));

  const grupoOptions = grupos.map((grupo) => ({
    value: grupo.id,
    label: grupo.nombreGenerado,
  }));

  const carreraOptions = [
    { value: "Ingeniería en Sistemas Computacionales", label: "Ingeniería en Sistemas Computacionales" },
    { value: "Ingeniería Industrial", label: "Ingeniería Industrial" },
    { value: "Ingeniería en Gestión Empresarial", label: "Ingeniería en Gestión Empresarial" },
    { value: "Ingeniería Mecatrónica", label: "Ingeniería Mecatrónica" },
    { value: "Ingeniería en Energías Renovables", label: "Ingeniería en Energías Renovables" },
  ];

  const onSubmit = async (data: CreateCargaAcademicaFormData) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    setIsLoading(true);

    try {
      const createRequest: CreateCargaAcademicaRequest = {
        token: accessToken,
        profesorId: data.profesorId,
        carrera: data.carrera,
        asignatura: data.asignatura,
        grupoId: data.grupoId,
      };

      await createCargaAcademica(createRequest);

      toast.success("Carga académica creada exitosamente");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear carga académica";
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
          <DialogTitle>Crear Nueva Carga Académica</DialogTitle>
          <DialogDescription>
            Complete los datos para asignar una nueva carga académica a un profesor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profesorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profesor *</FormLabel>
                  <FormControl>
                    <FormSelect
                      options={profesorOptions}
                      placeholder="Seleccione un profesor"
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
              name="carrera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera *</FormLabel>
                  <FormControl>
                    <FormSelect
                      options={carreraOptions}
                      placeholder="Seleccione una carrera"
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
              name="asignatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignatura *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre de la asignatura"
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
              name="grupoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo *</FormLabel>
                  <FormControl>
                    <FormSelect
                      options={grupoOptions}
                      placeholder="Seleccione un grupo"
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
                {isLoading ? "Creando..." : "Crear Carga Académica"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
