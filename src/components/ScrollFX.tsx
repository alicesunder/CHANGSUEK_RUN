import React, { useEffect, useRef } from 'react';

const CARD_SEL =
  '[class*="rounded-2xl"],[class*="rounded-3xl"],[class*="rounded-[2"]';
const SECTIONS = '#schedule-section,#routes,#hotels,#leaderboard,#weather-forecast,#runner-checklist,#faq';

/** Scroll progress bar with a running dog + staggered reveal of headings and cards. */
export const ScrollFX: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add('rv-in');
          el.classList.remove('rv-init');
          window.setTimeout(() => {
            el.classList.remove('rv-in');
            el.style.removeProperty('--rv-delay');
          }, 1400);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(SECTIONS).forEach((sec) => {
        const nodes = Array.from(sec.querySelectorAll<HTMLElement>(`h2, ${CARD_SEL}`));
        const counters = new Map<Element, number>();
        nodes.forEach((el) => {
          if (el.dataset.rv) return;
          if (el.closest('.leaflet-container, [role="dialog"], button, .rv-skip')) return;
          // only the outermost matching card
          const parent = el.parentElement?.closest(CARD_SEL);
          if (parent && sec.contains(parent) && el.tagName !== 'H2') return;
          el.dataset.rv = '1';
          const idx = counters.get(el.parentElement as Element) ?? 0;
          counters.set(el.parentElement as Element, idx + 1);
          el.style.setProperty('--rv-delay', `${Math.min(idx, 6) * 70}ms`);
          el.classList.add('rv-init');
          io.observe(el);
        });
      });
    };
    const t1 = window.setTimeout(scan, 400);
    const t2 = window.setTimeout(scan, 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={barRef} className="scroll-dog" aria-hidden="true" style={{ width: 0 }}>
      <span>🐕</span>
    </div>
  );
};
