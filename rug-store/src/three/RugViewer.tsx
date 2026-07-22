import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Specific submodule import, not the drei barrel — see RugMesh.tsx.
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import RugMesh from './RugMesh';

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
  const manualRotationRef = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const handleManualRotate = () => {
    setAutoRotate(false);
    setHasInteracted(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    if (!prefersReduced) {
      resumeTimer.current = setTimeout(() => setAutoRotate(true), 2000);
    }
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
        aria-label="Интерактивная 3D-модель ковра Бахтияри Ромб — потяните или используйте стрелки влево/вправо, чтобы рассмотреть со всех сторон"
      >
        <ambientLight intensity={0.55} color="#f3e6c9" />
        <directionalLight position={[3, 4, 2]} intensity={1.1} color="#ffd9a0" />
        <directionalLight position={[-3, 1, -2]} intensity={0.3} color="#7a8b6f" />
        <RugMesh
          autoRotate={autoRotate}
          manualRotationRef={manualRotationRef}
          onManualRotate={handleManualRotate}
          onTextureReady={onTextureReady}
        />
        <OrbitControls
          enablePan={false}
          minDistance={2.6}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          onStart={handleManualRotate}
        />
      </Canvas>
      <span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[13px] tracking-wide text-[#9C7A3E] transition-opacity duration-700 pointer-events-none"
        style={{ opacity: hasInteracted ? 0 : 1 }}
      >
        Бахтияри Ромб — потяните, чтобы рассмотреть
      </span>
    </div>
  );
}
