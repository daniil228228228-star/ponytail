// Overlay UI for RugViewer: weave swatches, autorotate toggle, view controls.
// Kept as real <button> elements (not div onClick) — the site's global
// `button:focus-visible` rule in index.css applies automatically, and every
// touch target here is 44px (Tailwind's `11` = 2.75rem), matching the same
// bar the nav links were held to in an earlier design-review pass.
// All icons are inline SVG — no icon library, per the bundle-budget constraint.

type Weave = { image: string; name: string };

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 0 1-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M5 12h14" />
    </svg>
  );
}

const chipButton =
  'flex items-center justify-center w-11 h-11 rounded-md text-walnut transition-colors duration-200 hover:bg-walnut/10';

export default function ViewerControls({
  weaves,
  activeIndex,
  onSelectWeave,
  autoRotate,
  onToggleAutoRotate,
  onReset,
  onZoomIn,
  onZoomOut,
}: {
  weaves: readonly Weave[];
  activeIndex: number;
  onSelectWeave: (index: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-3 md:bottom-4 flex items-end justify-between gap-2 px-3 md:px-4 pointer-events-none">
      <div className="flex gap-1.5 rounded-lg bg-wool/90 p-1.5 pointer-events-auto">
        {weaves.map((w, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={w.name}
              type="button"
              aria-pressed={isActive}
              aria-label={`Плетение «${w.name}»`}
              title={w.name}
              onClick={() => onSelectWeave(i)}
              className="w-11 h-11 rounded-md bg-cover bg-center transition-transform duration-300"
              style={{
                backgroundImage: `url(${w.image})`,
                border: isActive ? '2px solid #D9A441' : '2px solid rgba(36,25,20,0.15)',
                transform: isActive ? 'translateY(-2px)' : 'none',
                transitionTimingFunction: 'var(--ease-settle)',
              }}
            />
          );
        })}
      </div>

      <div className="flex gap-1 rounded-lg bg-wool/90 p-1.5 pointer-events-auto">
        <button
          type="button"
          aria-pressed={autoRotate}
          aria-label={autoRotate ? 'Остановить вращение' : 'Возобновить вращение'}
          title={autoRotate ? 'Остановить вращение' : 'Возобновить вращение'}
          onClick={onToggleAutoRotate}
          className={chipButton}
        >
          {autoRotate ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          aria-label="Отдалить"
          title="Отдалить"
          onClick={onZoomOut}
          className={chipButton}
        >
          <MinusIcon />
        </button>
        <button
          type="button"
          aria-label="Приблизить"
          title="Приблизить"
          onClick={onZoomIn}
          className={chipButton}
        >
          <PlusIcon />
        </button>
        <button
          type="button"
          aria-label="Сбросить вид"
          title="Сбросить вид"
          onClick={onReset}
          className={chipButton}
        >
          <RefreshIcon />
        </button>
      </div>
    </div>
  );
}
