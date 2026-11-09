import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const claudeProvider: Provider = {
  id: 'claude',
  name: 'Claude Code',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    
    // Check for CLAUDE.md in root
    const claudeFile = path.join(workspacePath, 'CLAUDE.md');
    if (await exists(claudeFile)) {
      nodes.push({
        id: claudeFile,
        name: 'CLAUDE.md',
        path: claudeFile,
        type: 'file',
        provider: 'claude',
        description: 'Claude configuration',
      });
    }

    // Check for .claude/agents
    const agentsDir = path.join(workspacePath, '.claude', 'agents');
    if (await exists(agentsDir)) {
      try {
        const entries = await listDir(agentsDir);
        for (const entry of entries) {
          if (!entry.is_dir && entry.name.endsWith('.md')) {
            nodes.push({
              id: entry.path,
              name: entry.name,
              path: entry.path,
              type: 'file',
              provider: 'claude',
              description: 'Claude subagent',
            });
          }
        }
      } catch (error) {
        console.error('Error reading Claude agents directory:', error);
      }
    }

    return nodes;
  },
};
