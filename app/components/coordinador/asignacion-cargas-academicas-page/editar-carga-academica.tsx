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
import { FormCheckbox } from "~/components/ui/forms/FormCheckbox";
import type { CargaAcademica } from "~/types/carga-academica";
import { updateCargaAcademica } from "~/services/carga-academica.service";
import { useAuthStore } from "~/store/auth";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useGrupos } from "~/hooks/useGrupos";
import { useCarreras } from "~/hooks/useCarreras";
import { RolUsuarioEnum } from "~/types/usuarios";

// Schema de validación con Zod
const updateCargaAcademicaSchema = z.object({
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
  esTutor: z.boolean().default(false),
});

type UpdateCargaAcademicaFormData = z.infer<typeof updateCargaAcademicaSchema>;

interface EditarCargaAcademicaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  cargaAcademica: CargaAcademica | null;
}

export function EditarCargaAcademicaModal({
  open,
  onOpenChange,
  onSuccess,
  cargaAcademica,
}: EditarCargaAcademicaModalProps) {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para obtener profesores y grupos
  const { usuarios: profesores } = useUsuarios({
    rol: RolUsuarioEnum.PROFESOR_TIEMPO_COMPLETO,
    activo: true,
    limit: 100,
  });

  const { usuarios: profesoresAsignatura } = useUsuarios({
    rol: RolUsuarioEnum.PROFESOR_ASIGNATURA,
    activo: true,
    limit: 100,
  });

  const { grupos } = useGrupos({
    activo: true,
    limit: 100,
  });

  // Hook para obtener carreras dinámicamente
  const { carreras } = useCarreras();

  const form = useForm<UpdateCargaAcademicaFormData>({
    resolver: zodResolver(
      updateCargaAcademicaSchema
    ) as Resolver<UpdateCargaAcademicaFormData>,
    defaultValues: {
      profesorId: "",
      carrera: "",
      asignatura: "",
      grupoId: "",
      esTutor: false,
    },
  });

  // Observar cambios en la carrera seleccionada
  const selectedCarrera = form.watch("carrera");

  // Opciones para selects
  const carreraOptions = carreras.map((carrera) => ({
    value: carrera.nombre,
    label: carrera.nombre,
  }));

  const grupoOptions = grupos.map((grupo) => ({
    value: grupo.id,
    label: grupo.nombreGenerado,
  }));

  // Combinar profesores de tiempo completo y asignatura
  const todosProfesores = [...profesores, ...profesoresAsignatura];

  const profesorOptions = todosProfesores.map((profesor) => ({
    value: profesor.id,
    label: `${profesor.nombre} ${profesor.apellido}`,
  }));

  // Actualizar formulario cuando cambie la carga académica
  useEffect(() => {
    if (cargaAcademica) {
      form.reset({
        profesorId: cargaAcademica.profesorId,
        carrera: cargaAcademica.carrera,
        asignatura: cargaAcademica.asignatura,
        grupoId: cargaAcademica.grupoId,
        esTutor: cargaAcademica.esTutor,
      });
    }
  }, [cargaAcademica, form]);

  const onSubmit = async (data: UpdateCargaAcademicaFormData) => {
    if (!cargaAcademica || !accessToken) {
      toast.error("Datos insuficientes para actualizar");
      return;
    }

    setIsLoading(true);

    try {
      const updateRequest = {
        token: accessToken,
        id: cargaAcademica.id,
        profesorId: data.profesorId,
        carrera: data.carrera,
        asignatura: data.asignatura,
        grupoId: data.grupoId,
        esTutor: data.esTutor,
      };

      await updateCargaAcademica(updateRequest);

      toast.success("Carga académica actualizada exitosamente");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar carga académica";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!cargaAcademica) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Carga Académica</DialogTitle>
          <DialogDescription>
            Modifique los datos de la carga académica seleccionada.
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

            <FormField
              control={form.control}
              name="esTutor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <FormCheckbox
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      label="¿Es tutor del grupo?"
                      helperText="Marque esta opción si el profesor será el tutor del grupo"
                    />
                  </FormControl>
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
                {isLoading ? "Actualizando..." : "Actualizar Carga Académica"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
