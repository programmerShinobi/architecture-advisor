import { useEffect, useState } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';

/**
 * Phone-only sticky bottom **primary action** for the Advisor (mobile-experience-plan.md): a
 * contextual "next" that scrolls the single-page flow forward — **Get your plan** → **Save & share**.
 * It is navigation sugar over the existing one-page Advisor; it changes no flow or model state. Sits
 * above the bottom tab bar; hidden ≥641px via CSS (`.aa-mobile-actionbar`).
 */
export function AdvisorMobileBar() {
  const { t } = useI18n();
  const [planInView, setPlanInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById('adv-plan');
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setPlanInView(e.isIntersecting), {
      // "in view" ≈ the recommendation reached the middle band of the viewport.
      rootMargin: '-45% 0px -45% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const targetId = planInView ? 'adv-save' : 'adv-plan';
  const label = planInView ? t('m.act.save') : t('m.act.plan');

  return (
    <div className="aa-mobile-actionbar screen-only">
      <button type="button" onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
        {label}
        <IconArrowDown size={16} aria-hidden />
      </button>
    </div>
  );
}
