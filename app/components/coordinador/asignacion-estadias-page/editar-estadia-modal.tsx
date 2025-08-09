import { useState, useEffect } from "react";
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
import { useEstadiaActions } from "~/hooks/estadias-hooks";
import { toast } from "sonner";
import type { Estadia } from "~/types/estadias";

const updateEstadiaSchema = z.object({
  periodo: z.string().min(1, "El período es requerido"),
  observacionesGenerales: z.string().optional(),
});

type UpdateEstadiaForm = z.infer<typeof updateEstadiaSchema>;

interface EditarEstadiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  estadia: Estadia | null;
}

export function EditarEstadiaModal({
  isOpen,
  onClose,
  onSuccess,
  estadia,
}: EditarEstadiaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { update } = useEstadiaActions();

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
  } = useForm<UpdateEstadiaForm>({
    resolver: zodResolver(updateEstadiaSchema),
  });

  // Cargar datos de la estadía cuando se abre el modal
  useEffect(() => {
    if (estadia && isOpen) {
      setValue("periodo", estadia.periodo);
      setValue("observacionesGenerales", estadia.observacionesGenerales || "");
    }
  }, [estadia, isOpen, setValue]);

  const onSubmit = async (data: UpdateEstadiaForm) => {
    if (!estadia) return;

    try {
      setIsSubmitting(true);
      await update(estadia.id, {
        periodo: data.periodo,
        observacionesGenerales: data.observacionesGenerales,
      });
      toast.success("Estadía actualizada exitosamente");
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar estadía";
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
          <DialogTitle>Editar Estadía</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Profesor Asignado</label>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium">
                {estadia?.profesor.nombre} {estadia?.profesor.apellido}
              </p>
              <p className="text-sm text-gray-600">{estadia?.profesor.email}</p>
            </div>
          </div>

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
              {isSubmitting ? "Actualizando..." : "Actualizar Estadía"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
