// Initialize and export all providers
import { providerRegistry } from './registry';
import { betterAgentsProvider } from './better-agents/detector';
import { geminiProvider } from './gemini/detector';
import { claudeProvider } from './claude/detector';
import { cursorProvider } from './cursor/detector';
import { copilotProvider } from './copilot/detector';
import { windsurfProvider } from './windsurf/detector';
import { clineProvider } from './cline/detector';
import { continueProvider } from './continue/detector';
import { aiderProvider } from './aider/detector';

// Register all providers
providerRegistry.register(betterAgentsProvider);
providerRegistry.register(geminiProvider);
providerRegistry.register(claudeProvider);
providerRegistry.register(cursorProvider);
providerRegistry.register(copilotProvider);
providerRegistry.register(windsurfProvider);
providerRegistry.register(clineProvider);
providerRegistry.register(continueProvider);
providerRegistry.register(aiderProvider);

export { providerRegistry };
export * from './types';
