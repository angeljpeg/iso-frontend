import { useState, useCallback } from "react";
import {
  createNecesidadesEspeciales,
  updateNecesidadesEspeciales,
  deleteNecesidadesEspeciales,
} from "../../services/necesidades-especiales.service";
import {
  type CreateNecesidadesEspecialesDto,
  type UpdateNecesidadesEspecialesDto,
  type NecesidadesEspeciales,
} from "../../types/necesidades-especiales";

interface UseNecesidadesEspecialesActionsReturn {
  createNecesidad: (
    data: CreateNecesidadesEspecialesDto
  ) => Promise<NecesidadesEspeciales | null>;
  updateNecesidad: (
    id: number,
    data: UpdateNecesidadesEspecialesDto
  ) => Promise<NecesidadesEspeciales | null>;
  deleteNecesidad: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: string | null;
  clearMessages: () => void;
}

export const useNecesidadesEspecialesActions =
  (): UseNecesidadesEspecialesActionsReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const createNecesidad = useCallback(
      async (
        data: CreateNecesidadesEspecialesDto
      ): Promise<NecesidadesEspeciales | null> => {
        try {
          setLoading(true);
          setError(null);
          setSuccess(null);

          const result = await createNecesidadesEspeciales({
            ...data,
            token: "your-token-here", // TODO: Get from auth context
          });
          setSuccess("Necesidad especial creada exitosamente");
          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al crear la necesidad especial";
          setError(errorMessage);
          console.error("Error creating necesidad especial:", err);
          return null;
        } finally {
          setLoading(false);
        }
      },
      []
    );

    const updateNecesidad = useCallback(
      async (
        id: number,
        data: UpdateNecesidadesEspecialesDto
      ): Promise<NecesidadesEspeciales | null> => {
        try {
          setLoading(true);
          setError(null);
          setSuccess(null);

          const result = await updateNecesidadesEspeciales({
            id: id.toString(),
            ...data,
            token: "your-token-here", // TODO: Get from auth context
          });
          setSuccess("Necesidad especial actualizada exitosamente");
          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al actualizar la necesidad especial";
          setError(errorMessage);
          console.error("Error updating necesidad especial:", err);
          return null;
        } finally {
          setLoading(false);
        }
      },
      []
    );

    const deleteNecesidad = useCallback(
      async (id: number): Promise<boolean> => {
        try {
          setLoading(true);
          setError(null);
          setSuccess(null);

          await deleteNecesidadesEspeciales({
            id: id.toString(),
            token: "your-token-here", // TODO: Get from auth context
          });
          setSuccess("Necesidad especial eliminada exitosamente");
          return true;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al eliminar la necesidad especial";
          setError(errorMessage);
          console.error("Error deleting necesidad especial:", err);
          return false;
        } finally {
          setLoading(false);
        }
      },
      []
    );

    const clearMessages = useCallback(() => {
      setError(null);
      setSuccess(null);
    }, []);

    return {
      createNecesidad,
      updateNecesidad,
      deleteNecesidad,
      loading,
      error,
      success,
      clearMessages,
    };
  };

// Hook para validar formularios de necesidades especiales
export const useNecesidadesEspecialesValidation = () => {
  const validateCreateForm = useCallback(
    (data: CreateNecesidadesEspecialesDto): string[] => {
      const errors: string[] = [];

      if (!data.fecha) {
        errors.push("La fecha es obligatoria");
      }

      if (!data.nombreAlumno?.trim()) {
        errors.push("El nombre del alumno es obligatorio");
      }

      if (!data.numeroMatricula?.trim()) {
        errors.push("El número de matrícula es obligatorio");
      }

      if (!data.programaEducativo?.trim()) {
        errors.push("El programa educativo es obligatorio");
      }

      if (!data.fechaRevision) {
        errors.push("La fecha de revisión es obligatoria");
      }

      if (!data.numeroRevision || data.numeroRevision <= 0) {
        errors.push("El número de revisión debe ser mayor a 0");
      }

      if (!data.cargaAcademicaId) {
        errors.push("La carga académica es obligatoria");
      }

      // Validar que al menos un tipo de excepción esté marcado
      const hasExcepciones =
        data.excepcionesConductuales ||
        data.excepcionesComunicacionales ||
        data.excepcionesIntelectuales ||
        data.excepcionesFisicas ||
        data.excepcionesSuperdotacion;

      if (!hasExcepciones) {
        errors.push("Debe seleccionar al menos un tipo de necesidad especial");
      }

      // Validar especificaciones cuando corresponda
      if (
        data.excepcionesConductuales &&
        !data.especificacionConductual?.trim()
      ) {
        errors.push("Debe especificar las necesidades conductuales");
      }

      if (
        data.excepcionesComunicacionales &&
        !data.especificacionComunicacional?.trim()
      ) {
        errors.push("Debe especificar las necesidades comunicacionales");
      }

      if (
        data.excepcionesIntelectuales &&
        !data.especificacionIntelectual?.trim()
      ) {
        errors.push("Debe especificar las necesidades intelectuales");
      }

      if (data.excepcionesFisicas && !data.especificacionFisica?.trim()) {
        errors.push("Debe especificar las necesidades físicas");
      }

      if (
        data.excepcionesSuperdotacion &&
        !data.especificacionSuperdotacion?.trim()
      ) {
        errors.push("Debe especificar las necesidades de superdotación");
      }

      return errors;
    },
    []
  );

  const validateUpdateForm = useCallback(
    (data: UpdateNecesidadesEspecialesDto): string[] => {
      const errors: string[] = [];

      // Para actualizaciones, solo validar los campos que se están enviando
      if (data.fecha && !data.fecha) {
        errors.push("La fecha debe ser válida");
      }

      if (data.nombreAlumno !== undefined && !data.nombreAlumno?.trim()) {
        errors.push("El nombre del alumno no puede estar vacío");
      }

      if (data.numeroMatricula !== undefined && !data.numeroMatricula?.trim()) {
        errors.push("El número de matrícula no puede estar vacío");
      }

      if (
        data.programaEducativo !== undefined &&
        !data.programaEducativo?.trim()
      ) {
        errors.push("El programa educativo no puede estar vacío");
      }

      if (data.numeroRevision !== undefined && data.numeroRevision <= 0) {
        errors.push("El número de revisión debe ser mayor a 0");
      }

      // Validar especificaciones cuando se marcan las excepciones
      if (
        data.excepcionesConductuales &&
        !data.especificacionConductual?.trim()
      ) {
        errors.push("Debe especificar las necesidades conductuales");
      }

      if (
        data.excepcionesComunicacionales &&
        !data.especificacionComunicacional?.trim()
      ) {
        errors.push("Debe especificar las necesidades comunicacionales");
      }

      if (
        data.excepcionesIntelectuales &&
        !data.especificacionIntelectual?.trim()
      ) {
        errors.push("Debe especificar las necesidades intelectuales");
      }

      if (data.excepcionesFisicas && !data.especificacionFisica?.trim()) {
        errors.push("Debe especificar las necesidades físicas");
      }

      if (
        data.excepcionesSuperdotacion &&
        !data.especificacionSuperdotacion?.trim()
      ) {
        errors.push("Debe especificar las necesidades de superdotación");
      }

      return errors;
    },
    []
  );

  return {
    validateCreateForm,
    validateUpdateForm,
  };
};
