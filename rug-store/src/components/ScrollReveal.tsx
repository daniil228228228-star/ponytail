import { useEffect, useRef, useState, type ReactNode } from 'react';

// Generic scroll-triggered reveal: fades + rises in once, the first time
// the wrapped content enters the viewport. Used for photography across
// Featured Weaves, Craft, and In Your Space so images arrive deliberately
// as the visitor scrolls, instead of simply being present on section
// mount. Uses the site's own --ease-settle curve (never a third easing
// curve, per IMPROVEMENT_PROMPT.md §5.1).
export default function ScrollReveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)',
        transition: `opacity 900ms var(--ease-settle) ${delayMs}ms, transform 900ms var(--ease-settle) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
