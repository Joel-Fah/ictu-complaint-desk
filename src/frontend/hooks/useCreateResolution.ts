import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResolution } from "@/lib/api";

export function useCreateResolution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createResolution,
        onSuccess: () => {
            // Re-fetch all resolutions after creating
            queryClient.invalidateQueries({ queryKey: ["resolutions"] });
        },
    });
}
