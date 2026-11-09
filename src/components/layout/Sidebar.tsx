import { useTranslation } from 'react-i18next';
import { Folder, FileText, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkspacesStore } from '@/stores/workspaces';
import { useEditorStore } from '@/stores/editor';
import { useWorkspaceScanner } from '@/features/workspaces/useWorkspaceScanner';
import { readTextFile } from '@/lib/tauri';
import { cn } from '@/lib/utils';
import type { ConfigNode } from '@/features/providers';

interface FileTreeNodeProps {
  node: ConfigNode;
  onClick: () => void;
}

function FileTreeNode({ node, onClick }: FileTreeNodeProps) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1 hover:bg-accent rounded-sm cursor-pointer text-sm"
      onClick={onClick}
    >
      {node.type === 'directory' ? (
        <>
          <ChevronRight className="h-3 w-3" />
          <Folder className="h-4 w-4 text-primary" />
        </>
      ) : (
        <>
          <span className="w-3" />
          <FileText className="h-4 w-4 text-muted-foreground" />
        </>
      )}
      <span className="truncate flex-1">{node.name}</span>
      <span className="text-xs text-muted-foreground">{node.provider}</span>
    </div>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const { workspaces, activeWorkspaceId } = useWorkspacesStore();
  const { openFile } = useEditorStore();
  const { configNodes, isScanning } = useWorkspaceScanner();

  const handleFileClick = async (node: ConfigNode) => {
    if (node.type === 'file') {
      try {
        const content = await readTextFile(node.path);
        const fileName = node.path.split('/').pop() || node.name;
        
        openFile({
          id: node.path,
          path: node.path,
          name: fileName,
          content,
          isDirty: false,
          language: fileName.endsWith('.md') ? 'markdown' : 
                   fileName.endsWith('.json') ? 'json' :
                   fileName.endsWith('.yml') || fileName.endsWith('.yaml') ? 'yaml' :
                   'plaintext',
        });
      } catch (error) {
        console.error('Error opening file:', error);
      }
    }
  };

  if (workspaces.length === 0) {
    return (
      <div className="w-64 bg-card p-4">
        <div className="text-sm text-muted-foreground text-center">
          <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{t('common.workspace.noWorkspaces')}</p>
          <p className="mt-2">{t('common.workspace.openFolder')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card flex flex-col">
      <div className="p-3 border-b">
        <h2 className="font-semibold text-sm">{t('common.sidebar.explorer')}</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={cn(
                "mb-4",
                workspace.id === activeWorkspaceId && "opacity-100",
                workspace.id !== activeWorkspaceId && "opacity-50"
              )}
            >
              <div className="flex items-center gap-2 mb-2 px-2">
                <Folder className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate">{workspace.name}</span>
              </div>
              
              {workspace.id === activeWorkspaceId && (
                <div className="ml-2 space-y-0.5">
                  {isScanning ? (
                    <div className="text-xs text-muted-foreground py-2 px-2">
                      Scanning...
                    </div>
                  ) : configNodes.length === 0 ? (
                    <div className="text-xs text-muted-foreground py-2 px-2">
                      No configuration files found
                    </div>
                  ) : (
                    configNodes.map((node) => (
                      <FileTreeNode
                        key={node.id}
                        node={node}
                        onClick={() => handleFileClick(node)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
