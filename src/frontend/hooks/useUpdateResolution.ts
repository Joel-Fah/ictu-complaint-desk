import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateResolution } from "@/lib/api";
import {CreateResolutionPayload} from "@/types/resolution";

export function useUpdateResolution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateResolutionPayload }) =>
            updateResolution(id, data),
        onSuccess: (_updated, variables) => {
            // Re-fetch all resolutions or the single resolution if you have per-resolution query
            queryClient.invalidateQueries({ queryKey: ["resolutions"] });
            queryClient.invalidateQueries({ queryKey: ["resolution", variables.id] });
        },
    });
}
