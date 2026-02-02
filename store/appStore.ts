
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'player' | 'library' | 'settings';
export type ThemeType = 'light' | 'dark' | 'auto';

export interface AppState {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  isAIAssistantOpen: boolean;
  toggleAIAssistant: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'player',
      setView: (view) => set({ currentView: view }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      accentColor: '#00f0ff',
      setAccentColor: (color) => set({ accentColor: color }),
      isAIAssistantOpen: false,
      toggleAIAssistant: () => set((state) => ({ isAIAssistantOpen: !state.isAIAssistantOpen })),
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'knoux-app-store',
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
