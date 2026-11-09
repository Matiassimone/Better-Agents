import type { Provider, ProviderRegistry, ConfigNode } from './types';

class Registry implements ProviderRegistry {
  providers: Map<string, Provider> = new Map();

  register(provider: Provider) {
    this.providers.set(provider.id, provider);
  }

  unregister(id: string) {
    this.providers.delete(id);
  }

  async detectAll(workspacePath: string): Promise<ConfigNode[]> {
    const results: ConfigNode[] = [];
    
    for (const provider of this.providers.values()) {
      try {
        const nodes = await provider.detect(workspacePath);
        results.push(...nodes);
      } catch (error) {
        console.error(`Error detecting ${provider.name}:`, error);
      }
    }

    return results;
  }

  getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }
}

export const providerRegistry = new Registry();
