// hooks/useCreateComplaint.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComplaint } from "@/lib/api";

export function useCreateComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComplaint,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
            // Optionally, invalidate user complaints
            queryClient.invalidateQueries({ queryKey: ["userComplaints"] });
        },
    });
}
