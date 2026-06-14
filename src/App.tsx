import { lazy, Suspense, useMemo } from 'react';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { FactorPanel } from './components/FactorPanel';
import { DimensionResults } from './components/DimensionResults';

// recharts is lazy-loaded into its own chunk, off the first-paint path (ADR-008 / NFR-PERF-3).
const QaWeightChart = lazy(() =>
  import('./components/QaWeightChart').then((m) => ({ default: m.QaWeightChart })),
);
import { useI18n } from './i18n/I18nContext';
import { usePersistedState } from './hooks/usePersistedState';
import { DEFAULT_LEVELS } from './config/defaults';
import { deriveWeights, rank } from './lib/scoring';
import type { Levels } from './types';

export default function App() {
  const { t } = useI18n();
  const [levels, setLevels] = usePersistedState<Levels>('aa.levels', DEFAULT_LEVELS);

  const weights = useMemo(() => deriveWeights(levels), [levels]);
  const d1 = useMemo(() => rank(levels, 'D1'), [levels]);

  return (
    <div className="min-h-full">
      <Disclaimer />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <FactorPanel levels={levels} onChange={setLevels} />
            <button
              type="button"
              onClick={() => setLevels(DEFAULT_LEVELS)}
              className="mt-3 rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
            >
              {t('action.reset')}
            </button>
          </div>

          <div className="space-y-6">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse rounded-xl border border-line bg-surface-2" />
              }
            >
              <QaWeightChart weights={weights} />
            </Suspense>
            <DimensionResults ranked={d1} />
          </div>
        </div>
      </main>
    </div>
  );
}
