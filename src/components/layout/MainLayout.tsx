import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { EditorPanel } from './EditorPanel';
import { Separator } from '@/components/ui/separator';

export function MainLayout() {

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Topbar */}
      <Topbar />
      <Separator />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        <Separator orientation="vertical" />
        
        {/* Editor Panel */}
        <EditorPanel />
      </div>
    </div>
  );
}
