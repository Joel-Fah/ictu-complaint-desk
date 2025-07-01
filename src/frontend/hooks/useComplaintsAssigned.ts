// hooks/useUserComplaints.ts
import { useQuery } from "@tanstack/react-query";
import { getComplaintsAssigned } from "@/lib/api";

export function useComplaintsAssigned(userId: number | undefined) {
    return useQuery({
        queryKey: ["userComplaints", userId],
        queryFn: () => getComplaintsAssigned(userId),
        enabled: !!userId,
        staleTime: 60 * 1000,
    });
}
