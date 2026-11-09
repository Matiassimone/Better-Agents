import { useEffect, useState } from 'react';
import { useWorkspacesStore } from '@/stores/workspaces';
import { providerRegistry, type ConfigNode } from '@/features/providers';

export function useWorkspaceScanner() {
  const { workspaces, activeWorkspaceId } = useWorkspacesStore();
  const [configNodes, setConfigNodes] = useState<ConfigNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const scanWorkspace = async () => {
      if (!activeWorkspaceId) {
        setConfigNodes([]);
        return;
      }

      const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
      if (!workspace) return;

      setIsScanning(true);
      try {
        const nodes = await providerRegistry.detectAll(workspace.path);
        setConfigNodes(nodes);
      } catch (error) {
        console.error('Error scanning workspace:', error);
        setConfigNodes([]);
      } finally {
        setIsScanning(false);
      }
    };

    scanWorkspace();
  }, [activeWorkspaceId, workspaces]);

  return { configNodes, isScanning };
}
