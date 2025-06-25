// stores/filterStore.ts
import { create } from "zustand";

interface FilterState {
    filter: string;
    setFilter: (value: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filter: "All",
    setFilter: (value) => set({ filter: value }),
}));
