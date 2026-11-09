import { useTranslation } from 'react-i18next';
import { X, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor';
import { writeTextFile } from '@/lib/tauri';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useEffect } from 'react';

export function EditorPanel() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { tabs, activeTabId, setActiveTab, closeTab, updateTabContent, markTabDirty } = useEditorStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  // Handle Ctrl/Cmd+S to save
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab && activeTab.isDirty) {
          await handleSave(activeTab.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleSave = async (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;

    try {
      await writeTextFile(tab.path, tab.content);
      markTabDirty(tabId, false);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  if (tabs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{t('common.editor.noFileOpen')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-card border-b overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer group min-w-0",
              tab.id === activeTabId ? "bg-accent" : "hover:bg-accent/50"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-sm truncate">
              {tab.name}
              {tab.isDirty && <span className="ml-1">•</span>}
            </span>
            {tab.isDirty && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(tab.id);
                }}
                title="Save (Ctrl/Cmd+S)"
              >
                <Save className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab && (
          <Editor
            height="100%"
            language={activeTab.language || 'markdown'}
            value={activeTab.content}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            onChange={(value) => {
              if (value !== undefined && value !== activeTab.content) {
                updateTabContent(activeTab.id, value);
                markTabDirty(activeTab.id, true);
              }
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: 'selection',
            }}
          />
        )}
      </div>
    </div>
  );
}
