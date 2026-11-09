import { ThemeProvider } from './providers/ThemeProvider';
import { I18nProvider } from './providers/I18nProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import '@/index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <I18nProvider>
        <MainLayout />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
