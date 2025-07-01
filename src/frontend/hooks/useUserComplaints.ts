// hooks/useUserComplaints.ts
import { useQuery } from "@tanstack/react-query";
import { getComplaintsByUser } from "@/lib/api";

export function useUserComplaints(userId: number | undefined) {
    return useQuery({
        queryKey: ["userComplaints", userId],
        queryFn: () => getComplaintsByUser(userId),
        enabled: !!userId,
        staleTime: 60 * 1000,
    });
}
