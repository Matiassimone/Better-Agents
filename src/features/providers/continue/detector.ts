import type { Provider, ConfigNode } from '../types';
import { exists } from '@/lib/tauri';
import * as path from 'path-browserify';

export const continueProvider: Provider = {
  id: 'continue',
  name: 'Continue',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for .continuerc.json in repo
    const continueRc = path.join(workspacePath, '.continuerc.json');
    if (await exists(continueRc)) {
      nodes.push({
        id: continueRc,
        name: '.continuerc.json',
        path: continueRc,
        type: 'file',
        provider: 'continue',
        description: 'Continue configuration',
      });
    }

    return nodes;
  },
};
