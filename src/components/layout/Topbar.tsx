import { useTranslation } from 'react-i18next';
import { FolderOpen, Search, Languages, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/stores/settings';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useWorkspacesStore } from '@/stores/workspaces';
import { open } from '@tauri-apps/plugin-dialog';

export function Topbar() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useSettingsStore();
  const { addWorkspace } = useWorkspacesStore();

  const handleOpenFolders = async () => {
    console.log('Opening folder dialog...');
    try {
      const selected = await open({
        directory: true,
        multiple: true,
        title: 'Select Folders',
      });

      console.log('Dialog result:', selected);

      if (selected) {
        const folders = Array.isArray(selected) ? selected : [selected];
        console.log('Processing folders:', folders);
        folders.forEach((path) => {
          const name = path.split('/').pop() || path;
          console.log('Adding workspace:', { path, name });
          addWorkspace({
            id: path,
            path,
            name,
            lastOpened: Date.now(),
          });
        });
      } else {
        console.log('No folders selected (user cancelled)');
      }
    } catch (error) {
      console.error('Failed to open folders:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="h-12 px-4 flex items-center gap-4 bg-card border-b">
      {/* Open Folders Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenFolders}
        className="gap-2"
      >
        <FolderOpen className="h-4 w-4" />
        {t('common.topbar.openFolders')}
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common.topbar.searchPlaceholder')}
          className="pl-9"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          title={t('common.topbar.language')}
        >
          <Languages className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={t('common.topbar.theme')}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
