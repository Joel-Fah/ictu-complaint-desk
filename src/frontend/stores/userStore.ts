import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { getUserById } from "@/lib/api";

interface UserState {
    user: User | null;
    isLoading: boolean;
    role: string;
    secondary_role: string;
    activeRoleTab: string;
    setActiveRoleTab: (role: string) => void;

    setRoles: (role: string, secondary_role?: string) => void;
    fetchUser: (id: number | string) => Promise<void>;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            role: "",
            secondary_role: "",
            activeRoleTab: "", // ✅ no default fallback

            setUser: (user) => set({
                user,
                role: user.role,
                secondary_role: user.secondary_role,
                activeRoleTab: user.role?.toLowerCase() || "" // ✅ always use actual role
            }),

            setRoles: (role, secondary_role = "") => set({
                role,
                secondary_role,
                activeRoleTab: role?.toLowerCase() || "" // ✅ same here
            }),

            setActiveRoleTab: (activeRoleTab) => set({ activeRoleTab }),

            fetchUser: async (id) => {
                set({ isLoading: true });
                try {
                    const user = await getUserById(id);
                    set({
                        user,
                        role: user.role,
                        secondary_role: user.secondary_role,
                        activeRoleTab: user.role?.toLowerCase() || "", // ✅ strict match to role
                        isLoading: false,
                    });
                } catch {
                    set({
                        user: null,
                        role: "",
                        secondary_role: "",
                        activeRoleTab: "",
                        isLoading: false,
                    });
                }
            },

            clearUser: () => set({
                user: null,
                role: "",
                secondary_role: "",
                activeRoleTab: ""
            }),
        }),
        {
            name: "user-storage",
            partialize: (state) => ({
                user: state.user,
                role: state.role,
                secondary_role: state.secondary_role,
                activeRoleTab: state.activeRoleTab,
            }),
        }
    )
);
