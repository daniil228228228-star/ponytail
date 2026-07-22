import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Specific submodule import, not the drei barrel — see RugMesh.tsx.
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
// Type-only: erased at build time, doesn't touch the bundle. Needed for a
// typed ref to the underlying three-stdlib controls instance (reset/dolly).
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import RugMesh, { WEAVE_TEXTURES } from './RugMesh';
import ContactShadow from './ContactShadow';
import ViewerControls from './ViewerControls';

// Weave names reused verbatim from FeaturedWeaves.tsx so the same photo
// is called the same thing everywhere on the site.
const WEAVES = [
  { image: WEAVE_TEXTURES[0], name: 'Бахтияри Ромб' },
  { image: WEAVE_TEXTURES[1], name: 'Охра Шеврон' },
  { image: WEAVE_TEXTURES[2], name: 'Марена Решётка' },
] as const;

const ZOOM_STEP = 1.2;

// Interactive 3D rug viewer — IMPROVEMENT_PROMPT.md §4.
// Idle: slow continuous auto-rotate (rotates the mesh itself). Drag/touch:
// pauses auto-rotate, OrbitControls orbits the camera around the object —
// visually equivalent to the object turning, just driven by camera instead
// of mesh rotation for that interaction. Release: resumes auto-rotate after
// ~2s from wherever it was left. Keyboard: left/right arrows rotate the
// mesh directly, same mechanism as auto-rotate (a11y requirement, §9).
// Reduced motion: no auto-rotate, fixed three-quarter view, drag/keys still work.
export default function RugViewer({ onTextureReady }: { onTextureReady: () => void }) {
  const prefersReduced = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const [autoRotate, setAutoRotate] = useState(!prefersReduced);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeWeave, setActiveWeave] = useState(0);
  const manualRotationRef = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  // Set once the visitor explicitly pauses via the toggle button, so a
  // subsequent drag's usual "resume after 2s idle" doesn't quietly override
  // an intentional pause — only the button itself un-pauses after that.
  const explicitPauseRef = useRef(false);

  const handleManualRotate = () => {
    setAutoRotate(false);
    setHasInteracted(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    if (!prefersReduced && !explicitPauseRef.current) {
      resumeTimer.current = setTimeout(() => setAutoRotate(true), 2000);
    }
  };

  const handleToggleAutoRotate = () => {
    setHasInteracted(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setAutoRotate((prev) => {
      const next = !prev;
      explicitPauseRef.current = !next && !prefersReduced;
      return next;
    });
  };

  const handleReset = () => {
    controlsRef.current?.reset();
  };

  const handleZoomIn = () => {
    controlsRef.current?.dollyIn(ZOOM_STEP);
    controlsRef.current?.update();
  };

  const handleZoomOut = () => {
    controlsRef.current?.dollyOut(ZOOM_STEP);
    controlsRef.current?.update();
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        manualRotationRef.current -= 0.12;
        handleManualRotate();
      } else if (e.key === 'ArrowRight') {
        manualRotationRef.current += 0.12;
        handleManualRotate();
      }
    };
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={canvasWrapperRef} className="relative w-full h-full" tabIndex={0}>
      <Canvas
        camera={{ position: [0, 2.4, 3.6], fov: 40 }}
        role="img"
        aria-label={`Интерактивная 3D-модель ковра «${WEAVES[activeWeave].name}» — потяните или используйте стрелки влево/вправо, чтобы рассмотреть со всех сторон. Рядом — кнопки смены плетения, паузы вращения и масштаба.`}
      >
        {/* Lower ambient + a third rim light for contrast — flat even
            lighting reads cheap, a key/fill/rim trio plus a ground shadow
            reads like an actual product shoot. */}
        <ambientLight intensity={0.38} color="#f3e6c9" />
        <directionalLight position={[3, 4, 2]} intensity={1.25} color="#ffd9a0" />
        <directionalLight position={[-3, 1, -2]} intensity={0.28} color="#7a8b6f" />
        <directionalLight position={[-1.5, 2.5, -3.5]} intensity={0.6} color="#fff3da" />
        <ContactShadow />
        <RugMesh
          autoRotate={autoRotate}
          manualRotationRef={manualRotationRef}
          onManualRotate={handleManualRotate}
          onTextureReady={onTextureReady}
          activeWeave={activeWeave}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.6}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          onStart={handleManualRotate}
        />
      </Canvas>
      <span
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-[13px] tracking-wide text-[#9C7A3E] transition-opacity duration-700 pointer-events-none"
        style={{ opacity: hasInteracted ? 0 : 1 }}
      >
        {WEAVES[activeWeave].name} — потяните, чтобы рассмотреть
      </span>
      <ViewerControls
        weaves={WEAVES}
        activeIndex={activeWeave}
        onSelectWeave={setActiveWeave}
        autoRotate={autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        onReset={handleReset}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
}
