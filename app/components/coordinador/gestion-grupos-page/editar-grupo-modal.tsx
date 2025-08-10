import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import { useGrupoActions } from "~/hooks/useGrupoActions";
import { useCuatrimestres } from "~/hooks/useCuatrimestres";
import { getCarrerasDisponibles } from "~/services/grupos";
import { useAuthStore } from "~/store/auth";
import type { Grupo } from "~/types/grupos";

interface EditarGrupoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupo: Grupo | null;
  onSuccess: () => void;
}

export function EditarGrupoModal({
  open,
  onOpenChange,
  grupo,
  onSuccess,
}: EditarGrupoModalProps) {
  const [formData, setFormData] = useState({
    carrera: "",
    cuatrimestre: "",
    numeroGrupo: "",
    cuatrimestreId: "",
  });
  const [carreras, setCarreras] = useState<string[]>([]);
  const [isLoadingCarreras, setIsLoadingCarreras] = useState(false);

  const { update, isLoading, error, clearError } = useGrupoActions();
  const { accessToken } = useAuthStore();

  // Hook para obtener cuatrimestres del backend
  const {
    cuatrimestres,
    isLoading: isLoadingCuatrimestres,
    error: cuatrimestresError,
  } = useCuatrimestres({
    limit: 50, // Obtener más cuatrimestres para tener opciones
  });

  // Cargar datos del grupo cuando se abre el modal
  useEffect(() => {
    if (grupo && open) {
      setFormData({
        carrera: grupo.carrera,
        cuatrimestre: grupo.cuatrimestre.toString(),
        numeroGrupo: grupo.numeroGrupo.toString(),
        cuatrimestreId: grupo.cuatrimestreId || "",
      });
    }
  }, [grupo, open]);

  // Cargar carreras disponibles
  useEffect(() => {
    const loadCarreras = async () => {
      if (!accessToken) return;

      try {
        setIsLoadingCarreras(true);
        const response = await getCarrerasDisponibles({ token: accessToken });
        setCarreras(response.data.map((carrera) => carrera.nombre));
      } catch (error) {
        console.error("Error al cargar carreras:", error);
        toast.error("Error al cargar carreras disponibles");
      } finally {
        setIsLoadingCarreras(false);
      }
    };

    if (open) {
      loadCarreras();
    }
  }, [open, accessToken]);

  const carreraOptions = [
    { value: "", label: "Seleccionar carrera" },
    ...carreras.map((carrera) => ({
      value: carrera,
      label: carrera,
    })),
  ];

  // Reemplazar las opciones hardcodeadas con cuatrimestres reales del backend
  const cuatrimestreOptions = [
    { value: "", label: "Seleccionar cuatrimestre" },
    ...cuatrimestres.map((cuatrimestre) => ({
      value: cuatrimestre.id,
      label: `${cuatrimestre.nombreGenerado} (${cuatrimestre.estado})`,
    })),
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grupo) return;

    if (!formData.carrera || !formData.cuatrimestre || !formData.numeroGrupo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      await update(grupo.id, {
        carrera: formData.carrera,
        cuatrimestre: parseInt(formData.cuatrimestre),
        numeroGrupo: parseInt(formData.numeroGrupo),
        cuatrimestreId: formData.cuatrimestreId || undefined,
      });

      toast.success("Grupo actualizado exitosamente");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (error) clearError();
  };

  if (!grupo) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo: {grupo.nombreGenerado}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Carrera */}
          <div>
            <label className="block mb-1 text-sm font-medium">Carrera *</label>
            <FormSelect
              value={formData.carrera}
              onChange={(e) => handleInputChange("carrera", e.target.value)}
              options={carreraOptions}
              placeholder="Seleccionar carrera"
              disabled={isLoadingCarreras}
            />
          </div>

          {/* Cuatrimestre */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Cuatrimestre *
            </label>
            <FormSelect
              options={cuatrimestreOptions}
              value={formData.cuatrimestreId}
              onChange={(e) => {
                const selectedCuatrimestre = cuatrimestres.find(
                  (c) => c.id === e.target.value
                );
                handleInputChange("cuatrimestreId", e.target.value);
                // También actualizar el número de cuatrimestre si es necesario
                if (selectedCuatrimestre) {
                  // Aquí podrías extraer el número del cuatrimestre si lo necesitas
                  // Por ejemplo, si el backend lo proporciona
                }
              }}
              placeholder="Seleccionar cuatrimestre"
              disabled={isLoadingCuatrimestres}
            />
            {isLoadingCuatrimestres && (
              <p className="mt-1 text-sm text-gray-500">
                Cargando cuatrimestres...
              </p>
            )}
            {cuatrimestresError && (
              <p className="mt-1 text-sm text-red-500">
                Error al cargar cuatrimestres: {cuatrimestresError}
              </p>
            )}
          </div>

          {/* Número de Grupo */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Número de Grupo *
            </label>
            <Input
              type="number"
              min="1"
              value={formData.numeroGrupo}
              onChange={(e) => handleInputChange("numeroGrupo", e.target.value)}
              placeholder="Ej: 1, 2, 3..."
            />
          </div>

          {/* ID de cuatrimestre (opcional) */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              ID de Cuatrimestre (opcional)
            </label>
            <Input
              value={formData.cuatrimestreId}
              onChange={(e) =>
                handleInputChange("cuatrimestreId", e.target.value)
              }
              placeholder="ID del cuatrimestre específico"
            />
          </div>

          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Grupo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
