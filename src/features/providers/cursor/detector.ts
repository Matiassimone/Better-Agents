import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const cursorProvider: Provider = {
  id: 'cursor',
  name: 'Cursor',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .cursorrules (legacy)
    const cursorRulesFile = path.join(workspacePath, '.cursorrules');
    if (await exists(cursorRulesFile)) {
      nodes.push({
        id: cursorRulesFile,
        name: '.cursorrules',
        path: cursorRulesFile,
        type: 'file',
        provider: 'cursor',
        description: 'Cursor rules (legacy)',
      });
    }

    // Check for .cursor/rules
    const rulesDir = path.join(workspacePath, '.cursor', 'rules');
    if (await exists(rulesDir)) {
      try {
        const entries = await listDir(rulesDir);
        for (const entry of entries) {
          if (!entry.is_dir && entry.name.endsWith('.mdc')) {
            nodes.push({
              id: entry.path,
              name: entry.name,
              path: entry.path,
              type: 'file',
              provider: 'cursor',
              description: 'Cursor rule',
            });
          }
        }
      } catch (error) {
        console.error('Error reading Cursor rules directory:', error);
      }
    }

    return nodes;
  },
};
