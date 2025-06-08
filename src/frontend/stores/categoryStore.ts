// @/store/categoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCategories } from "@/lib/api";
import { Category } from "@/types/category";

type CategoryState = {
    categories: Record<number, Category>;
    loading: boolean;
    fetchCategories: () => Promise<void>;
    resetCategories: () => void;
};

export const useCategoryStore = create(
    persist<CategoryState>(
        (set) => ({
            categories: {},
            loading: false,
            fetchCategories: async () => {
                set({ loading: true });
                try {
                    const data: Category[] = await getCategories();
                    const map = data.reduce((acc: Record<number, Category>, curr) => {
                        acc[curr.id] = curr;
                        return acc;
                    }, {});
                    set({ categories: map });
                } catch (error) {
                    console.error("Failed to fetch categories:", error);
                } finally {
                    set({ loading: false });
                }
            },
            resetCategories: () => set({ categories: {}, loading: false }),
        }),
        {
            name: "category-store",
        }
    )
);
