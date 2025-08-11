import { useMutation } from "@tanstack/react-query";
import { testAsesoriasRelations } from "~/services/asesorias.service";

export const useTestAsesoriasRelations = () => {
  return useMutation({
    mutationFn: testAsesoriasRelations,
    onError: (error) => {
      console.error("Error testing asesorías relations:", error);
    },
  });
};
