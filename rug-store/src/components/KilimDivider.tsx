import { useLayoutEffect, useRef } from 'react';

// The signature motif: a repeating stepped-diamond kilim border. Draws itself
// on (stroke-dashoffset) the first time it scrolls into view, instead of a
// generic fade-up — ties the motion to the brand's own pattern.
//
// The path is built as ONE continuous subpath (a single leading `M`, then
// `L` for every following point). SVG restarts the dash phase at the start
// of each subpath, so a repeated `M` per diamond (the original bug here)
// silently breaks the draw-on animation into 40 independent, near-instant
// dash cycles instead of one smooth left-to-right sweep.
//
// stroke-dasharray/dashoffset are set IMPERATIVELY on the DOM node in
// useLayoutEffect, not via React state. An earlier version stored the
// measured length in state and used a numeric fallback before the real
// getTotalLength() resolved — because the fallback wasn't an exact
// multiple of the real length, the dash pattern's ~2x period caused the
// reveal to wrap around and repaint from the wrong end for a frame.
// Measuring and setting both properties synchronously, before paint,
// avoids the intermediate value ever existing at all.
export default function KilimDivider({ color = '#B5432A' }: { color?: string }) {
  const wrapperRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const wrapper = wrapperRef.current;
    if (!path || !wrapper) return;

    const length = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    // force one layout flush so the "hidden" state above is committed
    // before re-enabling the transition — otherwise the browser may
    // coalesce it with the eventual dashoffset:0 write below and skip
    // the animation entirely.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.4s var(--ease-settle)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.style.strokeDashoffset = '0';
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const unit = 40;
  const repeats = 40;
  const points: string[] = [`M 0 7`];
  for (let i = 0; i < repeats; i++) {
    const x = i * unit;
    points.push(
      `L ${x + unit / 4} 0`,
      `L ${x + unit / 2} 7`,
      `L ${x + (unit * 3) / 4} 14`,
      `L ${x + unit} 7`
    );
  }
  const d = points.join(' ');

  return (
    <svg
      ref={wrapperRef}
      className="kilim-divider"
      viewBox={`0 0 ${unit * repeats} 14`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path ref={pathRef} d={d} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
