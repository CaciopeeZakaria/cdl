import { useState } from 'react';
import { ThemeProvider } from './theme';
import { Sidebar } from './components/Sidebar';
import { AnalyseCDL } from './components/AnalyseCDL';
import type { ViewMode } from './types';

function App() {
  const [view, setView] = useState<ViewMode>('analyse');

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
        <Sidebar view={view} setView={setView} />
        <main className="flex-1 min-w-0">
          {view === 'analyse' && <AnalyseCDL />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
