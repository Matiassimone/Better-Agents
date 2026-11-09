import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es';

interface SettingsState {
  theme: Theme;
  language: Language;
  skillsMarketplaceApiKey: string;
  globalPaths: Record<string, string>;
  
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setSkillsMarketplaceApiKey: (apiKey: string) => void;
  setGlobalPath: (key: string, path: string) => void;
  removeGlobalPath: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      skillsMarketplaceApiKey: '',
      globalPaths: {},

      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      setSkillsMarketplaceApiKey: (apiKey) =>
        set({ skillsMarketplaceApiKey: apiKey }),
      
      setGlobalPath: (key, path) =>
        set((state) => ({
          globalPaths: { ...state.globalPaths, [key]: path },
        })),
      
      removeGlobalPath: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.globalPaths;
          return { globalPaths: rest };
        }),
    }),
    {
      name: 'better-agents-settings',
    }
  )
);
