import { useEffect, useRef, useState } from 'react';
import { IMAGES } from '../images';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // slow parallax drift, capped so it never drifts far from center
      const drift = Math.max(-24, Math.min(24, rect.top * 0.08));
      setOffset(drift);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-walnut">
      <img
        src={IMAGES.heroTexture}
        alt=""
        className="parallax-layer absolute inset-0 h-full w-full object-cover"
        style={{ transform: `translateY(${offset}px) scale(1.08)` }}
      />
      {/* subtle scrim only behind the headline itself, not the whole photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-transparent to-walnut/20" />

      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24 max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl text-wool leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
          Every knot
          <br />
          is a decision.
        </h1>
        <p className="mt-5 text-wool/80 text-lg max-w-xl">
          Hand-knotted wool rugs, natural dyes, and pattern passed down through
          generations of loom-work — not printed, woven.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="bg-madder text-wool px-8 py-3 font-medium hover:bg-turmeric hover:text-walnut transition-colors">
            Shop the Collection
          </button>
          <button className="border border-wool/40 text-wool px-8 py-3 font-medium hover:bg-wool hover:text-walnut transition-colors">
            Our Craft
          </button>
        </div>
      </div>
    </section>
  );
}
