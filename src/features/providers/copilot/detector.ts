import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const copilotProvider: Provider = {
  id: 'copilot',
  name: 'GitHub Copilot',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .github/copilot-instructions.md
    const copilotFile = path.join(workspacePath, '.github', 'copilot-instructions.md');
    if (await exists(copilotFile)) {
      nodes.push({
        id: copilotFile,
        name: 'copilot-instructions.md',
        path: copilotFile,
        type: 'file',
        provider: 'copilot',
        description: 'GitHub Copilot instructions',
      });
    }

    // Check for .github/instructions/*.instructions.md
    const instructionsDir = path.join(workspacePath, '.github', 'instructions');
    if (await exists(instructionsDir)) {
      try {
        const entries = await listDir(instructionsDir);
        for (const entry of entries) {
          if (!entry.is_dir && entry.name.endsWith('.instructions.md')) {
            nodes.push({
              id: entry.path,
              name: entry.name,
              path: entry.path,
              type: 'file',
              provider: 'copilot',
              description: 'Copilot instruction',
            });
          }
        }
      } catch (error) {
        console.error('Error reading Copilot instructions directory:', error);
      }
    }

    return nodes;
  },
};
