import { useEffect, useRef, useState } from 'react';

// The signature motif: a repeating stepped-diamond kilim border. Draws itself
// on (stroke-dashoffset) the first time it scrolls into view, instead of a
// generic fade-up — ties the motion to the brand's own pattern.
export default function KilimDivider({ color = '#B5432A' }: { color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unit = 40;
  const repeats = 40;
  let d = '';
  for (let i = 0; i < repeats; i++) {
    const x = i * unit;
    d += `M ${x} 7 L ${x + unit / 4} 0 L ${x + unit / 2} 7 L ${x + (unit * 3) / 4} 14 L ${x + unit} 7 `;
  }

  return (
    <svg
      ref={ref}
      className={`kilim-divider ${inView ? 'in-view' : ''}`}
      viewBox={`0 0 ${unit * repeats} 14`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
