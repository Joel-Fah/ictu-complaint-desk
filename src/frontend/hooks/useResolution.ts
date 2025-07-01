import { useQuery } from "@tanstack/react-query";
import { allResolutions } from "@/lib/api";

export function useResolutions() {
    return useQuery({
        queryKey: ["resolutions"],
        queryFn: allResolutions,
        staleTime: 60 * 1000, // Adjust as you prefer
    });
}
