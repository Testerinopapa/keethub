import { create } from "zustand";

type SortMode = "default" | "name-asc" | "name-desc" | "recent";

interface HubState {
  search: string;
  activeCategory: string | null;
  sortMode: SortMode;
  recentlyPlayed: string[]; // slugs, most recent first
  setSearch: (v: string) => void;
  setCategory: (v: string | null) => void;
  setSortMode: (v: SortMode) => void;
  trackGameVisit: (slug: string) => void;
}

export const useHubStore = create<HubState>((set) => ({
  search: "",
  activeCategory: null,
  sortMode: "default",
  recentlyPlayed: [],

  setSearch: (search) => set({ search }),
  setCategory: (activeCategory) => set({ activeCategory }),
  setSortMode: (sortMode) => set({ sortMode }),

  trackGameVisit: (slug) =>
    set((s) => ({
      recentlyPlayed: [slug, ...s.recentlyPlayed.filter((x) => x !== slug)].slice(0, 6),
    })),
}));
