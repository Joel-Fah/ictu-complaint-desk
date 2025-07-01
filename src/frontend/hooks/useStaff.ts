// hooks/useStaff.ts
import { useQuery } from "@tanstack/react-query";
import { getAllStaff } from "@/lib/api";

export function useAllStaff() {
    return useQuery({
        queryKey: ["allStaff"],
        queryFn: getAllStaff,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true, // Refresh when user focuses the tab
    });
}

