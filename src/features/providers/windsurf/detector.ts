import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const windsurfProvider: Provider = {
  id: 'windsurf',
  name: 'Windsurf',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .windsurf/rules
    const rulesDir = path.join(workspacePath, '.windsurf', 'rules');
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
              provider: 'windsurf',
              description: 'Windsurf rule',
            });
          }
        }
      } catch (error) {
        console.error('Error reading Windsurf rules directory:', error);
      }
    }

    return nodes;
  },
};
