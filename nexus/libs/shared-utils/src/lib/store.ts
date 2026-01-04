'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  settings: {
    notifications: boolean;
    fontSize: number;
  };
  toggleTheme: () => void;
  updateFontSize: (size: number) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => ({
      theme: 'light',
      settings: {
        notifications: true,
        fontSize: 14,
      },
      toggleTheme: () =>
        set((state) => {
          // With Immer, you can mutate directly!
          state.theme = state.theme === 'light' ? 'dark' : 'light';
        }),
      updateFontSize: (size) =>
        set((state) => {
          // No need to spread nested objects (...state.settings)
          state.settings.fontSize = size;
        }),
    })),
    {
      name: 'theme-storage',
    }
  )
);