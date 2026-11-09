# Better Agents

**Better Agents** is an open-source desktop application for managing, configuring, and sharing AI Code Agent configurations across multiple tools and teams.

## 🎯 Problem

AI agent configuration is scattered across multiple tools (IDEs and CLIs), making it difficult to:
- Standardize configurations across teams
- Version control agent settings
- Share best practices and skills
- Maintain consistency across different AI coding tools

## ✨ Solution

Better Agents provides a unified interface to:
- **Manage multi-root workspaces** - Open multiple project folders simultaneously
- **Detect and edit configurations** - Automatically find and edit config files from 9+ AI agent tools
- **Share skills** - Install and share agent skills from the Skills Marketplace
- **Export/Import** - Easily copy configurations between projects or share with your team

## 🛠️ Supported AI Agent Tools

Better Agents detects and manages configuration files for:

1. **Better Agents** - `.agent/rules/`, `.agent/skills/`, `.agent/workflows/`
2. **Gemini CLI** - `GEMINI.md`
3. **Claude Code** - `CLAUDE.md`, `.claude/agents/`
4. **Cursor** - `.cursorrules`, `.cursor/rules/`
5. **GitHub Copilot** - `.github/copilot-instructions.md`, `.github/instructions/`
6. **Windsurf** - `.windsurf/rules/`
7. **Cline** - `.clinerules/`
8. **Continue** - `.continuerc.json`
9. **aider** - `.aider.conf.yml`

## 🚀 Getting Started

### Prerequisites

Before running Better Agents, you need to install:

1. **Rust** - Required for Tauri backend
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Node.js** (v18+) and **pnpm**
   ```bash
   npm install -g pnpm
   ```

3. **Tauri Prerequisites** - Follow the [Tauri prerequisites guide](https://tauri.app/start/prerequisites/) for your OS

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/better-agents.git
   cd better-agents
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run in development mode:
   ```bash
   pnpm tauri dev
   ```

4. Build for production:
   ```bash
   pnpm tauri build
   ```

## 📁 Project Structure

```
better-agents/
├── src/                          # Frontend source code
│   ├── app/                      # App bootstrap and providers
│   │   ├── App.tsx              # Main app component
│   │   └── providers/           # Theme and i18n providers
│   ├── stores/                   # Zustand state management
│   │   ├── workspaces.ts        # Multi-root workspace management
│   │   ├── editor.ts            # Editor tabs and content
│   │   ├── settings.ts          # User preferences
│   │   └── marketplace.ts       # Skills marketplace
│   ├── features/                 # Feature modules
│   │   ├── providers/           # Provider registry and detectors
│   │   │   ├── better-agents/   # Better Agents provider
│   │   │   ├── gemini/          # Gemini CLI provider
│   │   │   ├── claude/          # Claude Code provider
│   │   │   ├── cursor/          # Cursor provider
│   │   │   ├── copilot/         # GitHub Copilot provider
│   │   │   ├── windsurf/        # Windsurf provider
│   │   │   ├── cline/           # Cline provider
│   │   │   ├── continue/        # Continue provider
│   │   │   └── aider/           # aider provider
│   │   ├── workspaces/          # Workspace management
│   │   ├── explorer/            # File tree explorer
│   │   ├── editor/              # Monaco editor integration
│   │   ├── marketplace/         # Skills marketplace
│   │   └── export-import/       # Configuration export/import
│   ├── components/               # React components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/                      # Utilities
│   │   ├── utils.ts             # General utilities
│   │   └── tauri.ts             # Tauri command wrappers
│   └── locales/                  # i18n translations (ES/EN)
├── src-tauri/                    # Tauri backend (Rust)
│   └── src/
│       ├── commands/            # Tauri commands
│       │   ├── fs.rs           # Filesystem operations
│       │   ├── frontmatter.rs  # YAML frontmatter parsing
│       │   └── archive.rs      # ZIP export/import
│       └── lib.rs              # Main Tauri app
├── package.json                  # Frontend dependencies
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🏗️ Architecture

### Frontend (React + TypeScript)

- **State Management**: Zustand for global state
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Editor**: Monaco Editor for code/markdown editing
- **i18n**: react-i18next (English and Spanish)
- **Routing**: File-based routing with multi-root workspace support

### Backend (Tauri + Rust)

- **Filesystem Operations**: Secure file read/write via Tauri commands
- **Frontmatter Parsing**: YAML frontmatter extraction from markdown files
- **Archive Operations**: ZIP export/import for configuration sharing
- **Dialog Integration**: Native folder picker dialogs

### Provider System

Each provider implements a simple interface:

```typescript
interface Provider {
  id: string;
  name: string;
  detect: (workspacePath: string) => Promise<ConfigNode[]>;
}
```

Providers scan workspace directories and return detected configuration files.

## 🔧 Adding a New Provider

1. Create a new directory in `src/features/providers/your-provider/`

2. Create `detector.ts`:
   ```typescript
   import type { Provider, ConfigNode } from '../types';
   import { exists, listDir } from '@/lib/tauri';
   
   export const yourProvider: Provider = {
     id: 'your-provider',
     name: 'Your Provider',
     
     async detect(workspacePath: string): Promise<ConfigNode[]> {
       const nodes: ConfigNode[] = [];
       // Implement detection logic
       return nodes;
     },
   };
   ```

3. Register in `src/features/providers/index.ts`:
   ```typescript
   import { yourProvider } from './your-provider/detector';
   providerRegistry.register(yourProvider);
   ```

## 🌐 Internationalization

The app supports English and Spanish. To add a new language:

1. Create `src/locales/{lang}/common.json`
2. Add translations following the existing structure
3. Update `src/locales/index.ts` to include the new language

## 🎨 Theming

The app supports light and dark themes using Tailwind CSS and shadcn/ui. Theme variables are defined in `src/index.css`.

## 📦 Skills Marketplace

*(Note: SkillsMP integration requires API configuration)*

The Skills Marketplace allows you to:
- Search for skills by keyword or AI-powered search
- Install skills directly into your workspace
- Share custom skills with the community

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for the AI coding community**
