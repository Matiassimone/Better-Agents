import { create } from 'zustand';

export interface Skill {
  id: string;
  name: string;
  description: string;
  stars?: number;
  lastUpdate?: string;
  repoUrl?: string;
  downloadUrl?: string;
}

interface MarketplaceState {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  setSkills: (skills: Skill[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearResults: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  skills: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  setSkills: (skills) => set({ skills, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearResults: () => set({ skills: [], error: null, searchQuery: '' }),
}));
