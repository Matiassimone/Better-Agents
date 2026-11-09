import type { Provider, ConfigNode } from '../types';
import { exists } from '@/lib/tauri';
import * as path from 'path-browserify';

export const geminiProvider: Provider = {
  id: 'gemini',
  name: 'Gemini CLI',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    const geminiFile = path.join(workspacePath, 'GEMINI.md');

    if (await exists(geminiFile)) {
      nodes.push({
        id: geminiFile,
        name: 'GEMINI.md',
        path: geminiFile,
        type: 'file',
        provider: 'gemini',
        description: 'Gemini CLI configuration',
      });
    }

    return nodes;
  },
};
