// hooks/useComplaints.ts
import { useQuery } from "@tanstack/react-query";
import { getComplaints } from "@/lib/api";

export function useComplaints(page = 1, pageSize = 10) {
    return useQuery({
        queryKey: ["complaints", page, pageSize],
        queryFn: () => getComplaints(page, pageSize),
        staleTime: 60 * 1000, // 1 min
        placeholderData: (previousData) => previousData,
    });
}
