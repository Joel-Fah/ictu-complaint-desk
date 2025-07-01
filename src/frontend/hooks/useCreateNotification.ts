import {createNotification} from "@/lib/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export function useCreateNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNotification,
        onSuccess: () => {
            // Force re-fetch notifications
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}
