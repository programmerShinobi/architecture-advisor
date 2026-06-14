import { lazy, Suspense, useMemo } from 'react';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { FactorPanel } from './components/FactorPanel';
import { DimensionCard } from './components/DimensionCard';
import { CombinationView } from './components/CombinationView';
import { AntiPatternAlerts } from './components/AntiPatternAlerts';
import { useI18n } from './i18n/I18nContext';
import { usePersistedState } from './hooks/usePersistedState';
import { DEFAULT_LEVELS } from './config/defaults';
import { DIMENSIONS, DIMENSION_ORDER } from './config/dimensions';
import { deriveWeights, rank } from './lib/scoring';
import { detectAntiPatterns } from './lib/antiPatternEngine';
import type { DimensionId, Levels, RankedOption } from './types';

// recharts is lazy-loaded into its own chunk, off the first-paint path (ADR-008 / NFR-PERF-3).
const QaWeightChart = lazy(() =>
  import('./components/QaWeightChart').then((m) => ({ default: m.QaWeightChart })),
);

type Selections = Partial<Record<DimensionId, string>>;

export default function App() {
  const { t } = useI18n();
  const [levels, setLevels] = usePersistedState<Levels>('aa.levels', DEFAULT_LEVELS);
  const [selections, setSelections] = usePersistedState<Selections>('aa.selections', {});

  const weights = useMemo(() => deriveWeights(levels), [levels]);

  const rankings = useMemo(
    () =>
      Object.fromEntries(DIMENSION_ORDER.map((d) => [d, rank(levels, d)])) as Record<
        DimensionId,
        RankedOption[]
      >,
    [levels],
  );

  // Effective selection per dimension: the user's explicit choice, else the #1 recommendation.
  const effective = useMemo(
    () =>
      Object.fromEntries(
        DIMENSION_ORDER.map((d) => [d, selections[d] ?? rankings[d][0].id]),
      ) as Record<DimensionId, string>,
    [selections, rankings],
  );

  const antiPatterns = useMemo(
    () => detectAntiPatterns({ levels, selections: effective, migrationPathChosen: false }),
    [levels, effective],
  );

  const resetAll = () => {
    setLevels(DEFAULT_LEVELS);
    setSelections({});
  };

  return (
    <div className="min-h-full">
      <Disclaimer />
      <Header />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <FactorPanel levels={levels} onChange={setLevels} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
              >
                {t('action.reset')}
              </button>
              <button
                type="button"
                onClick={() => setSelections({})}
                className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
              >
                {t('action.followRec')}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <Suspense
              fallback={<div className="h-48 animate-pulse rounded-xl border border-line bg-surface-2" />}
            >
              <QaWeightChart weights={weights} />
            </Suspense>
            <CombinationView selections={effective} />
            <AntiPatternAlerts rules={antiPatterns} />
          </div>
        </div>

        <section aria-labelledby="dimensions-heading">
          <h2 id="dimensions-heading" className="text-lg font-semibold tracking-tight">
            {t('dimensions.heading')}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t('dimensions.intro')}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DIMENSION_ORDER.map((dim) => (
              <DimensionCard
                key={dim}
                dimension={DIMENSIONS[dim]}
                ranked={rankings[dim]}
                selectedId={effective[dim]}
                onSelect={(id) => setSelections({ ...selections, [dim]: id })}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
