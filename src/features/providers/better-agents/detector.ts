import type { Provider, ConfigNode } from '../types';
import { exists, listDir } from '@/lib/tauri';
import * as path from 'path-browserify';

export const betterAgentsProvider: Provider = {
  id: 'better-agents',
  name: 'Better Agents',
  
  async detect(workspacePath: string): Promise<ConfigNode[]> {
    const nodes: ConfigNode[] = [];
    const agentDir = path.join(workspacePath, '.agent');

    if (!(await exists(agentDir))) {
      return nodes;
    }

    // Detect rules
    const rulesDir = path.join(agentDir, 'rules');
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
              provider: 'better-agents',
              description: 'Agent rule',
            });
          }
        }
      } catch (error) {
        console.error('Error reading rules directory:', error);
      }
    }

    // Detect skills
    const skillsDir = path.join(agentDir, 'skills');
    if (await exists(skillsDir)) {
      try {
        const entries = await listDir(skillsDir);
        for (const entry of entries) {
          if (entry.is_dir) {
            const skillFile = path.join(entry.path, 'SKILL.md');
            if (await exists(skillFile)) {
              nodes.push({
                id: entry.path,
                name: entry.name,
                path: entry.path,
                type: 'directory',
                provider: 'better-agents',
                description: 'Skill',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error reading skills directory:', error);
      }
    }

    // Detect workflows
    const workflowsDir = path.join(agentDir, 'workflows');
    if (await exists(workflowsDir)) {
      try {
        const entries = await listDir(workflowsDir);
        for (const entry of entries) {
          if (!entry.is_dir && entry.name.endsWith('.md')) {
            nodes.push({
              id: entry.path,
              name: entry.name,
              path: entry.path,
              type: 'file',
              provider: 'better-agents',
              description: 'Workflow',
            });
          }
        }
      } catch (error) {
        console.error('Error reading workflows directory:', error);
      }
    }

    return nodes;
  },
};
