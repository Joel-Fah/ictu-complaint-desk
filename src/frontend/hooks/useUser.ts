"use client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";
import { User } from "@/types/user";
import { getAccessToken } from "@/lib/token";

/**
 * Fetch the authenticated user's profile.
 */
export function useUser() {
    return useQuery<User>({
        queryKey: ["user"],
        queryFn: async () => {
            const token = getAccessToken();
            if (!token) throw new Error("No access token");
            return await getUser(token);
        },
        enabled: !!getAccessToken(),
        staleTime: 1000 * 60 * 5, // Cache 5 min
    });
}
