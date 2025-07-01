import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from "@/lib/api";

export function useCreateAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAssignment,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["complaintAssignments", variables.complaint],
            });
        },
    });
}
