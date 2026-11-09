import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  path: string;
  name: string;
  lastOpened: number;
}

interface WorkspacesState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  recentWorkspaces: Workspace[];
  
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  clearWorkspaces: () => void;
}

export const useWorkspacesStore = create<WorkspacesState>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspaceId: null,
      recentWorkspaces: [],

      addWorkspace: (workspace) =>
        set((state) => {
          const exists = state.workspaces.find((w) => w.id === workspace.id);
          if (exists) {
            return {
              workspaces: state.workspaces.map((w) =>
                w.id === workspace.id ? { ...w, lastOpened: Date.now() } : w
              ),
              activeWorkspaceId: workspace.id,
            };
          }
          return {
            workspaces: [...state.workspaces, workspace],
            activeWorkspaceId: workspace.id,
            recentWorkspaces: [workspace, ...state.recentWorkspaces.slice(0, 9)],
          };
        }),

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspaceId:
            state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
        })),

      setActiveWorkspace: (id) =>
        set((state) => {
          const workspace = state.workspaces.find((w) => w.id === id);
          if (!workspace) return state;
          
          return {
            activeWorkspaceId: id,
            workspaces: state.workspaces.map((w) =>
              w.id === id ? { ...w, lastOpened: Date.now() } : w
            ),
          };
        }),

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      clearWorkspaces: () =>
        set({
          workspaces: [],
          activeWorkspaceId: null,
        }),
    }),
    {
      name: 'better-agents-workspaces',
    }
  )
);
