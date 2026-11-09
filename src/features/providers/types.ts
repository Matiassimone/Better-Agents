// Provider types and interfaces

export interface ConfigNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  provider: string;
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  detect: (workspacePath: string) => Promise<ConfigNode[]>;
  getIcon?: () => React.ReactNode;
}

export interface ProviderRegistry {
  providers: Map<string, Provider>;
  register: (provider: Provider) => void;
  unregister: (id: string) => void;
  detectAll: (workspacePath: string) => Promise<ConfigNode[]>;
  getProvider: (id: string) => Provider | undefined;
}
