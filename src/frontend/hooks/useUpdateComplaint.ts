// hooks/useUpdateComplaint.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComplaint, updateComp } from "@/lib/api";
import {Complaint} from "@/types/complaint";

// For updateComplaint, keep as is (expects an object with id and data)
export function useUpdateComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateComplaint,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
            queryClient.invalidateQueries({ queryKey: ["userComplaints"] });
            queryClient.invalidateQueries({ queryKey: ["complaint", variables.id] });
        },
    });
}

// For updateComp, wrap to accept { id, data }
export function useUpdateComp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: number; data: Partial<Complaint> }) => updateComp(data.id, data.data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
            queryClient.invalidateQueries({ queryKey: ["userComplaints"] });
            queryClient.invalidateQueries({ queryKey: ["complaintsAssigned"] });
            queryClient.invalidateQueries({ queryKey: ["complaint", variables.id] });
        },
    });
}