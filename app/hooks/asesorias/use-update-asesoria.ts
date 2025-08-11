import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAsesoria } from "~/services/asesorias.service";
import type { UpdateAsesoriaDto } from "~/types/asesorias";

export const useUpdateAsesoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAsesoria,
    onSuccess: (updatedAsesoria) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
      queryClient.invalidateQueries({ queryKey: ["asesorias", "paginated"] });

      // Actualizar la asesoría específica en el cache
      queryClient.setQueryData(
        ["asesoria", updatedAsesoria.id],
        updatedAsesoria
      );
    },
    onError: (error) => {
      console.error("Error updating asesoría:", error);
    },
  });
};

export const useUpdateAsesoriaWithOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAsesoria,
    onMutate: async ({ id, ...updateData }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["asesorias"] });
      await queryClient.cancelQueries({ queryKey: ["asesoria", id] });

      // Snapshot del valor anterior
      const previousAsesorias = queryClient.getQueryData(["asesorias"]);
      const previousAsesoria = queryClient.getQueryData(["asesoria", id]);

      // Actualización optimista en la lista
      queryClient.setQueryData(["asesorias"], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: old.data.map((asesoria: any) =>
              asesoria.id === id ? { ...asesoria, ...updateData } : asesoria
            ),
          };
        }
        return old;
      });

      // Actualización optimista en la asesoría individual
      if (previousAsesoria) {
        queryClient.setQueryData(["asesoria", id], {
          ...previousAsesoria,
          ...updateData,
        });
      }

      return { previousAsesorias, previousAsesoria };
    },
    onError: (err, variables, context) => {
      // Revertir en caso de error
      if (context?.previousAsesorias) {
        queryClient.setQueryData(["asesorias"], context.previousAsesorias);
      }
      if (context?.previousAsesoria) {
        queryClient.setQueryData(
          ["asesoria", variables.id],
          context.previousAsesoria
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Siempre refetch después de completar
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
      queryClient.invalidateQueries({ queryKey: ["asesoria", variables.id] });
    },
  });
};
