import { STAGE_INFO, type Stage } from '../types';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

export function StageBadge({ stage, size = 'md' }: { stage: Stage; size?: 'sm' | 'md' }) {
  const info = STAGE_INFO[stage];
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`chip ${info.bg} ${info.color} ${pad} font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
      {info.code} · {info.label}
    </span>
  );
}

export function StageTransition({ from, to }: { from: Stage; to: Stage }) {
  const fromInfo = STAGE_INFO[from];
  const toInfo = STAGE_INFO[to];
  const worsened = ['S1', 'S2', 'S3', 'S4'].indexOf(to) > ['S1', 'S2', 'S3', 'S4'].indexOf(from);
  const improved = ['S1', 'S2', 'S3', 'S4'].indexOf(to) < ['S1', 'S2', 'S3', 'S4'].indexOf(from);
  const Icon = worsened ? TrendingDown : improved ? TrendingUp : Minus;
  const color = worsened ? 'text-red-600 dark:text-red-400' : improved ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500';

  return (
    <div className="flex items-center gap-2">
      <span className={`chip ${fromInfo.bg} ${fromInfo.color} text-[11px] font-semibold`}>
        <span className={`w-1.5 h-1.5 rounded-full ${fromInfo.dot}`} />
        {fromInfo.code}
      </span>
      <ArrowRight className={`w-3.5 h-3.5 ${color}`} />
      <span className={`chip ${toInfo.bg} ${toInfo.color} text-[11px] font-semibold`}>
        <span className={`w-1.5 h-1.5 rounded-full ${toInfo.dot}`} />
        {toInfo.code}
      </span>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
    </div>
  );
}

export function ProvisionGauge({ taux, size = 'md' }: { taux: number; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  const stroke = size === 'sm' ? 3 : 4;
  const r = size === 'sm' ? 16 : size === 'lg' ? 26 : 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (taux / 100) * circ;
  const color = taux >= 75 ? '#ef4444' : taux >= 25 ? '#f59e0b' : taux >= 5 ? '#3b82f6' : '#16a34a';

  return (
    <div className={`relative ${dims} flex items-center justify-center`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth={stroke} className="stroke-gray-200 dark:stroke-slate-700" />
        <circle
          cx="20" cy="20"
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-[10px] font-bold text-gray-700 dark:text-slate-200">{taux}%</span>
    </div>
  );
}
