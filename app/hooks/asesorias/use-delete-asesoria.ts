import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsesoria } from "~/services/asesorias.service";

export const useDeleteAsesoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsesoria,
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
      queryClient.invalidateQueries({ queryKey: ["asesorias", "paginated"] });

      // Remover la asesoría específica del cache
      queryClient.removeQueries({ queryKey: ["asesoria", variables.id] });
    },
    onError: (error) => {
      console.error("Error deleting asesoría:", error);
    },
  });
};

export const useDeleteAsesoriaWithOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAsesoria,
    onMutate: async ({ id }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["asesorias"] });

      // Snapshot del valor anterior
      const previousAsesorias = queryClient.getQueryData(["asesorias"]);

      // Actualización optimista
      queryClient.setQueryData(["asesorias"], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: old.data.filter((asesoria: any) => asesoria.id !== id),
            total: old.total - 1,
          };
        }
        return old;
      });

      return { previousAsesorias };
    },
    onError: (err, variables, context) => {
      // Revertir en caso de error
      if (context?.previousAsesorias) {
        queryClient.setQueryData(["asesorias"], context.previousAsesorias);
      }
    },
    onSettled: (data, error, variables) => {
      // Siempre refetch después de completar
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
    },
  });
};
