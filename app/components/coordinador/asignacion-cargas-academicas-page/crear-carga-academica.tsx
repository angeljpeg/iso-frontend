import { useState, useEffect, useMemo } from "react";
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
import { createSeguimientoCurso } from "~/services/programacion-curso.service";
import { useAuthStore } from "~/store/auth";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useGrupos } from "~/hooks/useGrupos";
import { useCargaAcademica } from "~/hooks/useCargaAcademica";
import { useCarreras } from "~/hooks/useCarreras";
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
  const { accessToken, usuario } = useAuthStore();
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

  // Observar cambios en la carrera seleccionada
  const selectedCarrera = form.watch("carrera");

  // Hook para obtener cargas académicas existentes filtradas por carrera
  const { cargasAcademicas } = useCargaAcademica({
    carrera: selectedCarrera || undefined,
    limit: 1000, // Obtener todas las cargas para extraer asignaturas
  });

  // Extraer asignaturas únicas de las cargas académicas existentes
  const asignaturasDisponibles = useMemo(() => {
    if (!selectedCarrera || !cargasAcademicas.length) {
      return [];
    }

    // Extraer asignaturas únicas de la carrera seleccionada
    const asignaturasUnicas = Array.from(
      new Set(
        cargasAcademicas
          .filter((carga) => carga.carrera === selectedCarrera)
          .map((carga) => carga.asignatura)
      )
    );

    return asignaturasUnicas.map((asignatura) => ({
      value: asignatura,
      label: asignatura,
    }));
  }, [selectedCarrera, cargasAcademicas]);

  // Limpiar asignatura cuando cambie la carrera
  useEffect(() => {
    if (selectedCarrera) {
      form.setValue("asignatura", "");
    }
  }, [selectedCarrera, form]);

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

  // Opciones de carrera dinámicas
  const carreraOptions = carreras.map((carrera) => ({
    value: carrera.nombre,
    label: carrera.nombre,
  }));

  const onSubmit = async (data: CreateCargaAcademicaFormData) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    if (!usuario || usuario.rol !== RolUsuarioEnum.COORDINADOR) {
      toast.error("Solo los coordinadores pueden crear cargas académicas");
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

      // Crear la carga académica
      const cargaAcademica = await createCargaAcademica(createRequest);

      try {
        const seguimientoData = {
          token: accessToken,
          data: {
            cargaAcademicaId: cargaAcademica.id,
            cuatrimestreId: cargaAcademica.cuatrimestreId,
            // No se incluye fechaRevision como solicitado
          },
        };

        await createSeguimientoCurso(seguimientoData);

        toast.success("Carga académica y seguimiento creados exitosamente");
      } catch (seguimientoError) {
        // Si falla la creación del seguimiento, mostrar advertencia pero no fallar la operación
        console.error("Error al crear seguimiento:", seguimientoError);
        toast.error(
          "Carga académica creada pero hubo un problema al crear el seguimiento"
        );
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al crear carga académica";
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
            Complete los datos para asignar una nueva carga académica a un
            profesor.
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
                    {selectedCarrera && asignaturasDisponibles.length > 0 ? (
                      <FormSelect
                        options={[...asignaturasDisponibles]}
                        placeholder="Seleccione una asignatura"
                        {...field}
                        disabled={isLoading}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    ) : selectedCarrera ? (
                      <Input
                        placeholder="Ingrese el nombre de la asignatura"
                        {...field}
                        disabled={isLoading}
                      />
                    ) : (
                      <Input
                        placeholder="Primero seleccione una carrera"
                        disabled={true}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                  {selectedCarrera && asignaturasDisponibles.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      No hay asignaturas registradas para esta carrera. Puede
                      crear una nueva.
                    </p>
                  )}
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
