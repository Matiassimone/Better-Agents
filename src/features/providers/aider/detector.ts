import type { Provider, ConfigNode } from '../types';
import { exists } from '@/lib/tauri';
import * as path from 'path-browserify';

export const aiderProvider: Provider = {
  id: 'aider',
  name: 'aider',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .aider.conf.yml
    const aiderConf = path.join(workspacePath, '.aider.conf.yml');
    if (await exists(aiderConf)) {
      nodes.push({
        id: aiderConf,
        name: '.aider.conf.yml',
        path: aiderConf,
        type: 'file',
        provider: 'aider',
        description: 'aider configuration',
      });
    }

    return nodes;
  },
};
