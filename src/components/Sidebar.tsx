import { Sliders, CalendarClock, Search, Moon, Sun, ShieldCheck, ChevronRight, Workflow } from 'lucide-react';
import { useTheme } from '../theme';
import type { ViewMode } from '../types';

const NAV: { id: ViewMode; label: string; icon: typeof Sliders; desc: string }[] = [
  { id: 'regles', label: 'Studio des Règles', icon: Sliders, desc: 'Paramétrage métier' },
  { id: 'workflows', label: 'Workflows CDL', icon: Workflow, desc: 'Validation des déclassements' },
  { id: 'orchestrateur', label: 'Orchestrateur', icon: CalendarClock, desc: 'Planification des calculs' },
  { id: 'analyse', label: 'Analyse CDL', icon: Search, desc: 'Inspection des résultats' },
];

export function Sidebar({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col glass-strong border-r">
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-display font-extrabold text-base text-gray-900 dark:text-white leading-tight">CDL Works</div>
          <div className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">Classification & Provisionnement</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const active = view === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${active ? 'text-brand-600 dark:text-brand-400' : ''}`} />
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold leading-tight">{item.label}</div>
                <div className="text-[11px] text-gray-400 dark:text-slate-500 leading-tight">{item.desc}</div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          );
        })}
      </nav>

      <div className="p-3 space-y-2">
        <div className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-slate-200">S. Alaoui</div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400">Analyste Risque</div>
              </div>
            </div>
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
