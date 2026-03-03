import { create } from "zustand";
import { Filters } from "@/types";

interface FiltersStore extends Filters {
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  resetFilters: () => void;
}

const initialState: Filters = {
  dateRange: undefined,
  agent: undefined,
  destination: undefined,
  status: undefined,
  priority: undefined,
  packageType: undefined,
  searchText: undefined,
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  ...initialState,
  setFilter: (key, value) => set({ [key]: value }),
  clearFilters: () => set(initialState),
  resetFilters: () => set(initialState),
}));
