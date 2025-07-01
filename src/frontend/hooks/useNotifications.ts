import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/lib/api";
import {Notification} from "@/types/notifications";

export function useNotifications(userId: number | undefined) {
    return useQuery({
        queryKey: ["notifications", userId],
        queryFn: async () => {
            if (!userId) return [];
            const data = await getNotifications();
            return data.filter((n: Notification) => n.recipient === userId);
        },
        enabled: !!userId,
        staleTime: 60 * 1000, // Consider fresh for 1 min
        refetchOnWindowFocus: true,
    });
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => markNotificationAsRead(id),
        onSuccess: () => {
            // Invalidate to force refresh
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}
