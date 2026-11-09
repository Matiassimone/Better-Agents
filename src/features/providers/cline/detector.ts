import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const clineProvider: Provider = {
  id: 'cline',
  name: 'Cline',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .clinerules
    const rulesDir = path.join(workspacePath, '.clinerules');
    if (await exists(rulesDir)) {
      try {
        const entries = await listDir(rulesDir);
        for (const entry of entries) {
          if (!entry.is_dir && entry.name.endsWith('.md')) {
            nodes.push({
              id: entry.path,
              name: entry.name,
              path: entry.path,
              type: 'file',
              provider: 'cline',
              description: 'Cline rule',
            });
          }
        }
      } catch (error) {
        console.error('Error reading Cline rules directory:', error);
      }
    }

    return nodes;
  },
};
