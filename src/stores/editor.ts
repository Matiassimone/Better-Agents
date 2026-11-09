import { create } from 'zustand';

export interface EditorTab {
  id: string;
  path: string;
  name: string;
  content: string;
  isDirty: boolean;
  language?: string;
}

interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  
  openFile: (tab: EditorTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  markTabDirty: (id: string, isDirty: boolean) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  tabs: [],
  activeTabId: null,

  openFile: (tab) =>
    set((state) => {
      const existingTab = state.tabs.find((t) => t.path === tab.path);
      if (existingTab) {
        return { activeTabId: existingTab.id };
      }
      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      const closedTabIndex = state.tabs.findIndex((t) => t.id === id);
      
      let newActiveTabId = state.activeTabId;
      if (state.activeTabId === id) {
        if (newTabs.length > 0) {
          const newIndex = Math.min(closedTabIndex, newTabs.length - 1);
          newActiveTabId = newTabs[newIndex]?.id || null;
        } else {
          newActiveTabId = null;
        }
      }
      
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTabContent: (id, content) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, content } : t
      ),
    })),

  markTabDirty: (id, isDirty) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === id ? { ...t, isDirty } : t
      ),
    })),

  closeAllTabs: () => set({ tabs: [], activeTabId: null }),

  closeOtherTabs: (id) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === id);
      return tab
        ? { tabs: [tab], activeTabId: id }
        : state;
    }),
}));
