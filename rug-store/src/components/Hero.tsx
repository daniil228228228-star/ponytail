import RugViewerLazy from '../three/RugViewerLazy';

// v2 recomposition — IMPROVEMENT_PROMPT.md §3.1. Replaces the flat
// gradient-scrim-over-photo with a true split composition: solid walnut
// ground on the left carries the headline with zero scrim needed (there's
// no text-over-photo overlap at all), the photo/3D-viewer region is a hard
// vertical edge on the right. This also resolves the earlier a11y finding
// about nav contrast depending on the photo's unpredictable brightness —
// the nav now sits over solid walnut, full stop.
export default function Hero() {
  return (
    <section className="relative w-full bg-walnut md:flex md:h-screen md:min-h-[720px]">
      <div className="relative z-10 md:w-[42%] px-6 md:px-12 pt-28 pb-16 md:py-0 md:flex md:flex-col md:justify-center">
        <h1
          className="font-display text-5xl md:text-6xl lg:text-7xl text-wool leading-[1.05]"
          style={{ letterSpacing: '-0.02em' }}
        >
          Каждый узел —
          <br />
          это решение.
        </h1>
        <p className="mt-5 text-wool/80 text-lg max-w-xl">
          Ковры ручной работы из шерсти, натуральные красители и узор,
          передающийся через поколения ткачей — не напечатано, а соткано.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="woven-sweep bg-madder text-wool px-8 py-3 font-medium">
            Выбрать ковёр
          </button>
          <button className="border border-wool/40 text-wool px-8 py-3 font-medium transition-colors duration-200 hover:bg-wool hover:text-walnut">
            Наше ремесло
          </button>
        </div>
      </div>

      <div className="relative md:w-[58%] h-[70vh] md:h-auto">
        <RugViewerLazy />
      </div>
    </section>
  );
}
