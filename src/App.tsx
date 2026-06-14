import { useMemo, useRef, useState } from 'react';
import { Header, type Mode } from './components/Header';
import { GuidedBanner } from './components/GuidedBanner';
import { StepTracker } from './components/StepTracker';
import { PresetBar } from './components/PresetBar';
import { Toolbar } from './components/Toolbar';
import { C4Preview } from './components/C4Preview';
import { FactorInputs } from './components/FactorInputs';
import { PrioritiesCard } from './components/PrioritiesCard';
import { DimensionCards } from './components/DimensionCards';
import { DimensionDetail } from './components/DimensionDetail';
import { RadarPanel } from './components/RadarPanel';
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
import { PRESETS } from './config/presets';
import { DIMENSIONS, DIMENSION_ORDER } from './config/dimensions';
import { effectiveWeights, rankWith, sensitivity, type Overrides } from './lib/scoring';
import { detectAntiPatterns } from './lib/antiPatternEngine';
import { generateC4 } from './lib/c4';
import type { ExportInput } from './lib/snapshot';
import type { ScenarioState } from './lib/scenarioIO';
import type { DimensionId, Levels, RankedOption } from './types';

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
  const [editWeights, setEditWeights] = useState(false);
  const [currentDim, setCurrentDim] = useState<DimensionId>('D1');
  const undoRef = useRef<{ levels: Levels; selections: Selections; overrides: Overrides } | null>(null);

  const scenario: ScenarioState = { v: 1, mode, lang, levels, selections, overrides };
  const exportInput: ExportInput = { levels, overrides, selections: effective, lang };

  const activePresetId =
    PRESETS.find((p) => JSON.stringify(p.levels) === JSON.stringify(levels))?.id ?? null;

  const applyPreset = (next: Levels) => {
    setLevels(next);
    setSelections({});
    setOverrides({});
  };
  const resetAll = () => {
    undoRef.current = { levels, selections, overrides };
    applyPreset(DEFAULT_LEVELS);
  };
  const undoReset = () => {
    const snap = undoRef.current;
    if (!snap) return;
    setLevels(snap.levels);
    setSelections(snap.selections);
    setOverrides(snap.overrides);
  };

  const importScenario = (st: ScenarioState) => {
    setMode(st.mode);
    setLang(st.lang);
    setLevels(st.levels);
    setSelections(st.selections);
    setOverrides(st.overrides);
  };

  const saveSig = `${JSON.stringify(levels)}|${JSON.stringify(selections)}|${JSON.stringify(overrides)}|${mode}|${lang}`;

  return (
    <div style={{ padding: '24px' }}>
      <div className="page" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-xl)', padding: '16px' }}>
          <div
            id="f-app"
            className={mode}
            style={{
              position: 'relative',
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden',
            }}
          >
            <Header
              mode={mode}
              onToggleMode={setMode}
              onCmdK={() => {}}
              onHelp={() => {}}
              saveSig={saveSig}
            />
            <GuidedBanner />
            <StepTracker />

            <div style={{ padding: '18px 20px' }} className="space-y-6">
        <PresetBar activeId={activePresetId} onApply={applyPreset} onReset={resetAll} onUndo={undoReset} />

        <div className="f-div" />

        {/* Step 1 — project factors + derived priorities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="f-num">1</span>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>
            <span className="guided-only">{t('step1.g')}</span>
            <span className="expert-only">{t('step1.e')}</span>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '18px' }}>
          <FactorInputs levels={levels} onChange={setLevels} />
          <PrioritiesCard weights={weights} onAdjust={() => setEditWeights((v) => !v)} />
        </div>
        {mode === 'expert' && editWeights && (
          <div style={{ marginTop: '14px' }}>
            <QaOverridePanel weights={weights} overrides={overrides} onChange={setOverrides} />
          </div>
        )}

        <div className="f-div" />

        {/* Step 3 — recommendation across dimensions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '13px' }}>
          <span className="f-num">3</span>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>
            <span className="guided-only">{t('results.title.g')}</span>
            <span className="expert-only">{t('results.title.e')}</span>
          </span>
        </div>
        <DimensionCards rankings={rankings} current={currentDim} onSelect={setCurrentDim} />
        <DimensionDetail dim={currentDim} ranked={rankings[currentDim]} weights={weights} />
        <RadarPanel weights={weights} mode={mode} />
        <div style={{ marginTop: '14px' }}>
          <AntiPatternAlerts rules={antiPatterns} />
        </div>

        <section aria-labelledby="analysis-heading">
          <h2 id="analysis-heading" className="text-lg font-semibold tracking-tight">
            {t('analysis.heading')}
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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

        <div className="f-div" />
        <Toolbar exportInput={exportInput} scenario={scenario} onImport={importScenario} />

              <p
                className="f-gloss"
                style={{ marginTop: '20px', paddingTop: '14px', borderTop: '0.5px solid var(--color-border-tertiary)' }}
              >
                {t('disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
