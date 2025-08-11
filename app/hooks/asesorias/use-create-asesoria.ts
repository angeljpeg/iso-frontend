import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsesoria } from "~/services/asesorias.service";
import type { CreateAsesoriaDto } from "~/types/asesorias";

export const useCreateAsesoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAsesoria,
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
      queryClient.invalidateQueries({ queryKey: ["asesorias", "paginated"] });
    },
    onError: (error) => {
      console.error("Error creating asesoría:", error);
    },
  });
};

export const useCreateAsesoriaWithOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAsesoria,
    onMutate: async (newAsesoria) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ["asesorias"] });

      // Snapshot del valor anterior
      const previousAsesorias = queryClient.getQueryData(["asesorias"]);

      // Actualización optimista
      queryClient.setQueryData(["asesorias"], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: [newAsesoria, ...old.data],
            total: old.total + 1,
          };
        }
        return old;
      });

      return { previousAsesorias };
    },
    onError: (err, newAsesoria, context) => {
      // Revertir en caso de error
      if (context?.previousAsesorias) {
        queryClient.setQueryData(["asesorias"], context.previousAsesorias);
      }
    },
    onSettled: () => {
      // Siempre refetch después de completar
      queryClient.invalidateQueries({ queryKey: ["asesorias"] });
    },
  });
};
