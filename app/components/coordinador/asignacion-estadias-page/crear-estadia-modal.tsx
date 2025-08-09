import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/Button";
import { Textarea } from "~/components/ui/textarea";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useEstadiaActions } from "~/hooks/estadias-hooks";
import { toast } from "sonner";

const createEstadiaSchema = z.object({
  profesorId: z.string().min(1, "Debe seleccionar un profesor"),
  periodo: z.string().min(1, "El período es requerido"),
  observacionesGenerales: z.string().optional(),
});

type CreateEstadiaForm = z.infer<typeof createEstadiaSchema>;

interface CrearEstadiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CrearEstadiaModal({
  isOpen,
  onClose,
  onSuccess,
}: CrearEstadiaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useEstadiaActions();

  const { usuarios: profesores } = useUsuarios({
    limit: 100,
  });

  // Filtrar solo profesores
  const profesoresFiltrados = profesores.filter(
    (usuario) =>
      usuario.rol === "profesor_tiempo_completo" ||
      usuario.rol === "profesor_asignatura"
  );

  const profesorOptions = profesoresFiltrados.map((profesor) => ({
    value: profesor.id,
    label: `${profesor.nombre} ${profesor.apellido}`,
  }));

  const periodoOptions = [
    { value: "2024-1", label: "2024-1" },
    { value: "2024-2", label: "2024-2" },
    { value: "2024-3", label: "2024-3" },
    { value: "2025-1", label: "2025-1" },
    { value: "2025-2", label: "2025-2" },
    { value: "2025-3", label: "2025-3" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateEstadiaForm>({
    resolver: zodResolver(createEstadiaSchema),
  });

  const onSubmit = async (data: CreateEstadiaForm) => {
    try {
      setIsSubmitting(true);
      await create({
        periodo: data.periodo,
        observacionesGenerales: data.observacionesGenerales,
      });
      toast.success("Estadía creada exitosamente");
      reset();
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear estadía";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Estadía</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período *</label>
            <FormSelect
              options={periodoOptions}
              value={watch("periodo") || ""}
              onChange={(value) => setValue("periodo", value.target.value)}
              placeholder="Seleccionar período"
            />
            {errors.periodo && (
              <p className="text-sm text-red-600">{errors.periodo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Observaciones Generales
            </label>
            <Textarea
              {...register("observacionesGenerales")}
              placeholder="Observaciones sobre la estadía..."
              rows={3}
            />
            {errors.observacionesGenerales && (
              <p className="text-sm text-red-600">
                {errors.observacionesGenerales.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Estadía"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
