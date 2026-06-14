import { lazy, Suspense, useMemo, useState } from 'react';
import { Header, type Mode } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { PresetBar } from './components/PresetBar';
import { Toolbar } from './components/Toolbar';
import { C4Preview } from './components/C4Preview';
import { FactorPanel } from './components/FactorPanel';
import { DimensionCard } from './components/DimensionCard';
import { CombinationView } from './components/CombinationView';
import { AntiPatternAlerts } from './components/AntiPatternAlerts';
import { QaOverridePanel } from './components/QaOverridePanel';
import { ContributionTable } from './components/ContributionTable';
import { SensitivityCard } from './components/SensitivityCard';
import { RiskRegister } from './components/RiskRegister';
import { FitnessFunctions } from './components/FitnessFunctions';
import { CostOpsBadges } from './components/CostOpsBadges';
import { MethodologyPanel } from './components/MethodologyPanel';
import { Glossary } from './components/Glossary';
import { useI18n } from './i18n/I18nContext';
import { usePersistedState } from './hooks/usePersistedState';
import { DEFAULT_LEVELS } from './config/defaults';
import { DIMENSIONS, DIMENSION_ORDER } from './config/dimensions';
import { effectiveWeights, rankWith, sensitivity, type Overrides } from './lib/scoring';
import { detectAntiPatterns } from './lib/antiPatternEngine';
import { generateC4 } from './lib/c4';
import type { ExportInput } from './lib/snapshot';
import type { ScenarioState } from './lib/scenarioIO';
import type { DimensionId, Levels, RankedOption } from './types';

// recharts components are lazy-loaded, off the first-paint path (ADR-008 / NFR-PERF-3).
const QaWeightChart = lazy(() =>
  import('./components/QaWeightChart').then((m) => ({ default: m.QaWeightChart })),
);
const RadarTradeoff = lazy(() =>
  import('./components/RadarTradeoff').then((m) => ({ default: m.RadarTradeoff })),
);

const chartFallback = (
  <div className="h-72 animate-pulse rounded-xl border border-line bg-surface-2" />
);

type Selections = Partial<Record<DimensionId, string>>;

export default function App() {
  const { t, lang, setLang } = useI18n();
  const [mode, setMode] = usePersistedState<Mode>('aa.mode', 'guided');
  const [levels, setLevels] = usePersistedState<Levels>('aa.levels', DEFAULT_LEVELS);
  const [selections, setSelections] = usePersistedState<Selections>('aa.selections', {});
  const [overrides, setOverrides] = usePersistedState<Overrides>('aa.overrides', {});

  const weights = useMemo(() => effectiveWeights(levels, overrides), [levels, overrides]);

  const rankings = useMemo(
    () =>
      Object.fromEntries(DIMENSION_ORDER.map((d) => [d, rankWith(weights, d)])) as Record<
        DimensionId,
        RankedOption[]
      >,
    [weights],
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

  const flips = useMemo(() => sensitivity(levels, 'D1', overrides), [levels, overrides]);

  const selectedD1 =
    DIMENSIONS.D1.options.find((o) => o.id === effective.D1) ?? DIMENSIONS.D1.options[0];

  const [showC4, setShowC4] = useState(false);

  const scenario: ScenarioState = { v: 1, mode, lang, levels, selections, overrides };
  const exportInput: ExportInput = { levels, overrides, selections: effective, lang };

  const applyPreset = (next: Levels) => {
    setLevels(next);
    setSelections({});
    setOverrides({});
  };
  const resetAll = () => applyPreset(DEFAULT_LEVELS);

  const importScenario = (st: ScenarioState) => {
    setMode(st.mode);
    setLang(st.lang);
    setLevels(st.levels);
    setSelections(st.selections);
    setOverrides(st.overrides);
  };

  return (
    <div className="min-h-full">
      <Disclaimer />
      <Header mode={mode} onToggleMode={() => setMode(mode === 'guided' ? 'expert' : 'guided')} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <PresetBar onApply={applyPreset} />
        <Toolbar exportInput={exportInput} scenario={scenario} onImport={importScenario} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            <FactorPanel levels={levels} onChange={setLevels} />
            <div className="flex flex-wrap gap-2">
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
            {mode === 'expert' && (
              <QaOverridePanel weights={weights} overrides={overrides} onChange={setOverrides} />
            )}
          </div>

          <div className="space-y-6">
            <Suspense fallback={chartFallback}>
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

        <section aria-labelledby="analysis-heading">
          <h2 id="analysis-heading" className="text-lg font-semibold tracking-tight">
            {t('analysis.heading')}
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Suspense fallback={chartFallback}>
              <RadarTradeoff ranked={rankings.D1} />
            </Suspense>
            <ContributionTable weights={weights} option={selectedD1} />
            <SensitivityCard flips={flips} levels={levels} />
            <CostOpsBadges />
            <FitnessFunctions weights={weights} />
            <RiskRegister selections={effective} />
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setShowC4((v) => !v)}
                className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
                aria-expanded={showC4}
              >
                {showC4 ? t('c4.hide') : t('c4.show')}
              </button>
              {showC4 && (
                <div className="mt-3">
                  <C4Preview code={generateC4(effective.D1)} />
                </div>
              )}
            </div>
            <MethodologyPanel />
            <Glossary />
          </div>
        </section>
      </main>
    </div>
  );
}
