import { create } from 'zustand';

type Platform = 'youtube' | 'instagram';

interface AppState {
  credits: number;
  selectedPlatform: Platform;
  setCredits: (credits: number) => void;
  setPlatform: (platform: Platform) => void;
  decrementCredits: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  credits: 10, // Default 10 for testing UI
  selectedPlatform: 'youtube',
  setCredits: (c) => set({ credits: c }),
  setPlatform: (p) => set({ selectedPlatform: p }),
  decrementCredits: () => set((state) => ({ credits: state.credits - 1 })),
}));