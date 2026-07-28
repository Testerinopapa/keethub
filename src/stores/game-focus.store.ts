import { create } from "zustand";

interface GameFocusState {
  isActive: boolean;
  setActive: (active: boolean) => void;
}

export const useGameFocusStore = create<GameFocusState>((set) => ({
  isActive: false,
  setActive: (active) => set({ isActive: active }),
}));
