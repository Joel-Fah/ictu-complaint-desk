// userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";
import { getUserById } from "../lib/api";

interface UserState {
    user: User | null;
    isLoading: boolean;
    fetchUser: (id: number | string) => Promise<void>;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            fetchUser: async (id) => {
                set({ isLoading: true });
                try {
                    const user = await getUserById(id);
                    set({ user });
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "user-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )
);
