import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { IconBulb, IconCompass, IconHome } from '@tabler/icons-react';
import { AuroraBackground } from './components/chrome/AuroraBackground';
import { MobileChrome } from './components/chrome/MobileChrome';
import { AdvisorMobileBar } from './components/chrome/AdvisorMobileBar';
import { LandingView } from './components/landing/LandingView';
import { Header, type Mode } from './components/chrome/Header';
import { CommandPalette, type Command } from './components/chrome/CommandPalette';
import { ShortcutsModal } from './components/overlays/ShortcutsModal';
import { ScenarioCompare } from './components/advisor/ScenarioCompare';
import { PrintReport } from './components/overlays/PrintReport';
import { Collapsible } from './components/advisor/Collapsible';
import { GuidedBanner } from './components/chrome/GuidedBanner';
import { StepTracker } from './components/chrome/StepTracker';
import { PresetBar } from './components/advisor/PresetBar';
import { Toolbar } from './components/chrome/Toolbar';
import { C4Preview } from './components/advisor/C4Preview';
import { FactorInputs } from './components/advisor/FactorInputs';
import { PrioritiesCard } from './components/advisor/PrioritiesCard';
import { DimensionCards } from './components/advisor/DimensionCards';
import { DimensionDetail } from './components/advisor/DimensionDetail';
import { RadarPanel } from './components/advisor/RadarPanel';
import { SensitivityCard } from './components/advisor/SensitivityCard';
import { MigrationCard } from './components/advisor/MigrationCard';
import { AntiPatternWarning } from './components/advisor/AntiPatternWarning';
import { HowItDecides } from './components/advisor/HowItDecides';
import { QaOverridePanel } from './components/advisor/QaOverridePanel';
import { RiskRegister } from './components/advisor/RiskRegister';
import { FitnessFunctions } from './components/advisor/FitnessFunctions';
import { CostOpsBadges } from './components/advisor/CostOpsBadges';
import { MethodologyPanel } from './components/overlays/MethodologyPanel';
import { Glossary } from './components/overlays/Glossary';
import { useI18n } from './i18n/I18nContext';
import { usePersistedState } from './hooks/usePersistedState';
import { useTheme } from './hooks/useTheme';
import { useExportActions } from './hooks/useExportActions';
import { DEFAULT_LEVELS } from './config/defaults';
import { PRESETS } from './config/presets';
import type { MigrationKey } from './config/migrationPaths';
import { DIMENSION_ORDER } from './config/dimensions';
import { effectiveWeights, rankWith, sensitivity, type Overrides } from './lib/scoring';
import { detectAntiPatterns } from './lib/antiPatternEngine';
import type { ExportInput } from './lib/snapshot';
import type { ScenarioState } from './lib/scenarioIO';
import { SITE_COPYRIGHT } from './config/site';
import type { DimensionId, Levels, RankedOption } from './types';

// The Manual/Guide is lazy-loaded: it is an on-demand modal and now carries the detailed,
// evidence-grounded architecture explanations (readerContent), so keeping it out of the initial
// bundle preserves the first-load perf budget.
const ManualBook = lazy(() => import('./components/overlays/ManualBook'));

// The "Learn" content area is a lazy-loaded island: its articles + markdown renderer stay out of
// the Advisor's initial bundle. The Advisor remains the default view.
const LearnView = lazy(() => import('./components/insights/LearnView'));

type Selections = Partial<Record<DimensionId, string>>;

export default function App() {
  const { t, lang, setLang } = useI18n();
  const [mainView, setMainView] = usePersistedState<'home' | 'advisor' | 'learn'>('aa.main', 'home');
  // A pending Insights deep-link target (set from the landing's pattern cards).
  const [learnTarget, setLearnTarget] = useState<{ dim: DimensionId; optId: string } | null>(null);
  const [mode, setMode] = usePersistedState<Mode>('aa.mode', 'guided');
  const [theme, toggleTheme] = useTheme();
  // Top nav + mobile bottom bar share this: a plain Insights visit clears any landing deep-link.
  const navigate = (v: 'home' | 'advisor' | 'learn') => {
    if (v === 'learn') setLearnTarget(null);
    setMainView(v);
  };
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

  const [editWeights, setEditWeights] = useState(false);
  const [currentDim, setCurrentDim] = useState<DimensionId>('D1');
  const [migKey, setMigKey] = useState<MigrationKey>('big');
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

  const { status: exportStatus, setStatus: setExportStatus, run } = useExportActions(exportInput, scenario, weights);
  const [overlay, setOverlay] = useState<'palette' | 'shortcuts' | 'manual' | 'compare' | null>(null);
  const [snapA, setSnapA] = usePersistedState<ScenarioState | null>('aa.snapA', null);
  const [snapB, setSnapB] = usePersistedState<ScenarioState | null>('aa.snapB', null);

  const commands: Command[] = [
    { label: t('pal.save'), hint: '⌘S', run: run.adr },
    { label: t('pal.report'), run: run.report },
    { label: t('pal.csv'), run: () => { setMode('expert'); run.csv(); } },
    { label: t('pal.json'), run: () => { setMode('expert'); run.json(); } },
    { label: t('pal.share'), run: () => void run.share() },
    { label: t('pal.reset'), run: resetAll },
    { label: t('pal.expert'), run: () => setMode('expert') },
    { label: t('pal.guided'), run: () => setMode('guided') },
    { label: t('pal.sample'), run: () => applyPreset(PRESETS[0].levels) },
    { label: t('pal.manual'), run: () => setOverlay('manual') },
    { label: t('pal.pinA'), run: () => setSnapA(scenario) },
    { label: t('pal.pinB'), run: () => setSnapB(scenario) },
    { label: t('pal.compare'), run: () => setOverlay('compare') },
    { label: t('pal.print'), run: () => window.print() },
    { label: t('pal.shortcuts'), run: () => setOverlay('shortcuts') },
  ];

  // Global shortcuts: ⌘K palette, ⌘S save, Esc close. Use a ref so the listener stays stable —
  // updated in an effect, not during render (react-hooks v7 `refs` rule).
  const adrRef = useRef(run.adr);
  useEffect(() => {
    adrRef.current = run.adr;
  }, [run.adr]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOverlay('palette');
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        adrRef.current();
      } else if (e.key === 'Escape') {
        setOverlay(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Aurora Slate: pointer-following glow on Insights cards (ADR-009). Fine-pointer only, skipped
  // under reduced-motion, throttled to one rAF; sets the --mx/--my the `.learn-card::before` reads.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.('.learn-card') as HTMLElement | null;
      if (!card || raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        raf = 0;
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
    <AuroraBackground />
    <MobileChrome mainView={mainView} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} mode={mode} onSetMode={setMode} />
    {mainView === 'advisor' && <AdvisorMobileBar />}
    <div className={'screen-only aa-page' + (mainView === 'advisor' ? ' has-actionbar' : '')}>
      <div className="page aa-frame">
        {/* Borderless full-bleed shell (Fase 1): no framed box — content floats on the aurora
            canvas; the header/nav are glass. The extra wrapper div is gone with the frame. */}
        <div>
          <div id="f-app" className={mode} style={{ position: 'relative' }}>
            <Header
              mode={mode}
              onToggleMode={setMode}
              onCmdK={() => setOverlay('palette')}
              onHelp={() => setOverlay('shortcuts')}
              onManual={() => setOverlay('manual')}
              theme={theme}
              onToggleTheme={toggleTheme}
              saveSig={saveSig}
            />

            <nav aria-label={t('m.primaryNav')} className="screen-only aa-topnav aa-glass">
              {(
                [
                  { v: 'home', key: 'nav.home', Icon: IconHome },
                  { v: 'advisor', key: 'nav.advisor', Icon: IconCompass },
                  { v: 'learn', key: 'nav.learn', Icon: IconBulb },
                ] as const
              ).map(({ v, key, Icon }) => {
                const active = mainView === v;
                return (
                  <button
                    key={v}
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigate(v)}
                    className={'aa-topnav-tab' + (active ? ' on' : '')}
                  >
                    <Icon size={15} aria-hidden />
                    {t(key)}
                  </button>
                );
              })}
            </nav>

            {mainView === 'home' ? (
              <div className="aa-panel">
                <LandingView
                  onStart={() => setMainView('advisor')}
                  onOpenInsights={() => setMainView('learn')}
                  onOpenArch={(dim, optId) => {
                    setLearnTarget({ dim, optId });
                    setMainView('learn');
                  }}
                />
              </div>
            ) : mainView === 'learn' ? (
              <Suspense fallback={<div style={{ padding: 'var(--aa-panel-pad)', color: 'var(--color-text-tertiary)' }}>{t('save.saving')}</div>}>
                <LearnView
                  onOpenAdvisor={() => setMainView('advisor')}
                  onLoadLab={(labLevels) => {
                    setLevels(labLevels);
                    setMainView('advisor');
                  }}
                  initialTarget={learnTarget}
                />
              </Suspense>
            ) : (
            <>
            <GuidedBanner />
            <StepTracker />

            <div className="aa-panel space-y-6">
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
          <PrioritiesCard weights={weights} onAdjust={() => setEditWeights((v) => !v)} editing={mode === 'expert' && editWeights} />
        </div>
        {mode === 'expert' && editWeights && (
          <div style={{ marginTop: '14px' }}>
            <QaOverridePanel weights={weights} overrides={overrides} onChange={setOverrides} />
          </div>
        )}

        <div className="f-div" />

        {/* Step 3 — recommendation across dimensions */}
        <div id="adv-plan" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '13px', scrollMarginTop: '12px' }}>
          <span className="f-num">3</span>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>
            <span className="guided-only">{t('results.title.g')}</span>
            <span className="expert-only">{t('results.title.e')}</span>
          </span>
        </div>
        <DimensionCards rankings={rankings} current={currentDim} onSelect={setCurrentDim} />
        <DimensionDetail dim={currentDim} ranked={rankings[currentDim]} weights={weights} />
        <RadarPanel weights={weights} mode={mode} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '14px', marginTop: '16px' }}>
          <SensitivityCard flips={flips} levels={levels} />
          <MigrationCard value={migKey} onChange={setMigKey} />
        </div>

        <AntiPatternWarning rules={antiPatterns} mode={mode} />
        <HowItDecides />

        {/* Expert-only depth (build-spec features beyond the prototype mockup). Guided mode
            stays faithful to the prototype; experts get the extra analysis. */}
        <section className="expert-only" aria-labelledby="analysis-heading">
          <div className="f-div" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '13px' }}>
            <span style={{ fontSize: '15px', fontWeight: 500 }} id="analysis-heading">
              {t('analysis.heading')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Collapsible title={t('costops.heading')}>
              <CostOpsBadges bare />
            </Collapsible>
            <Collapsible title={t('fitness.heading')}>
              <FitnessFunctions weights={weights} bare />
            </Collapsible>
            <Collapsible title={t('risk.heading')}>
              <RiskRegister selections={effective} bare />
            </Collapsible>
            <Collapsible title={t('methodology.heading')}>
              <MethodologyPanel bare />
            </Collapsible>
            <Collapsible title={t('c4.heading')}>
              <C4Preview optionId={effective.D1} />
            </Collapsible>
            <Glossary />
          </div>
        </section>

        <div id="adv-save" className="f-div" style={{ scrollMarginTop: '12px' }} />
        <Toolbar run={run} status={exportStatus} setStatus={setExportStatus} mode={mode} onImport={importScenario} />

              <p
                className="f-gloss"
                style={{ marginTop: '20px', paddingTop: '14px', borderTop: '0.5px solid var(--color-border-tertiary)' }}
              >
                {t('disclaimer')}
              </p>
            </div>
            </>
            )}

            <CommandPalette open={overlay === 'palette'} commands={commands} onClose={() => setOverlay(null)} />
            <ShortcutsModal open={overlay === 'shortcuts'} onClose={() => setOverlay(null)} />
            {overlay === 'manual' && (
              <Suspense fallback={null}>
                <ManualBook open onClose={() => setOverlay(null)} levels={levels} weights={weights} />
              </Suspense>
            )}
            <ScenarioCompare
              open={overlay === 'compare'}
              onClose={() => setOverlay(null)}
              snapA={snapA}
              snapB={snapB}
              onPinA={() => setSnapA(scenario)}
              onPinB={() => setSnapB(scenario)}
              onClear={() => {
                setSnapA(null);
                setSnapB(null);
              }}
              onSwap={() => {
                const a = snapA;
                setSnapA(snapB);
                setSnapB(a);
              }}
            />

            {/* Global footer — always visible (both Advisor & Insights); browser guidance (FR-EDGE-4 / SRS §2.3)
                + copyright & identity (Fase 1, DECISIONS.md). Borderless: whitespace, no hairline. */}
            <footer
              className="screen-only"
              style={{
                padding: 'var(--aa-space-6) var(--aa-panel-pad) var(--aa-space-4)',
                fontSize: 'var(--aa-fs-2xs)',
                color: 'var(--color-text-tertiary)',
                textAlign: 'center',
              }}
            >
              <div>{t('footer.browsers')}</div>
              <div style={{ marginTop: 'var(--aa-space-2)' }}>
                {SITE_COPYRIGHT} · {t('footer.rights')}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
    <PrintReport exportInput={exportInput} />
    </>
  );
}
