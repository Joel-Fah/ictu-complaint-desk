import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCategories } from "@/lib/api";

type CategoryState = {
    categories: Record<number, string>;
    loading: boolean;
    fetchCategories: () => Promise<void>;
};

export const useCategoryStore = create(
    persist<CategoryState>(
        (set) => ({
            categories: {},
            loading: false,
            fetchCategories: async () => {
                set({ loading: true });
                try {
                    const data = await getCategories();
                    const map = data.reduce((acc: Record<number, string>, curr:any) => {
                        acc[curr.id] = curr.name;
                        return acc;
                    }, {});
                    set({ categories: map });
                } catch (error) {
                    console.error("Failed to fetch categories:", error);
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "category-store",
        }
    )
);
