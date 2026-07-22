import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
// Import the specific submodule, not the drei barrel — bypasses
// re-exports for unrelated helpers and keeps the lazy 3D chunk smaller
// (IMPROVEMENT_PROMPT.md §8/§10 bundle budget).
import { useTexture } from '@react-three/drei/core/Texture';
import type { Mesh, MeshPhysicalMaterial } from 'three';
import { IMAGES } from '../images';

// The three weave options the viewer can switch between, in the same
// order as the swatch buttons in ViewerControls.
export const WEAVE_TEXTURES = [IMAGES.foldedRug, IMAGES.rolledRug, IMAGES.heroTexture] as const;

const CROSSFADE_SECONDS = 0.45;

// Three.js material opacity can't read a CSS custom property, so the
// --ease-settle control points (index.css) are duplicated here as plain
// numbers — a texture swap "settling in" is exactly the entrance case
// that curve is for. Keep these in sync if that token ever changes.
const EASE_SETTLE = [0.22, 1, 0.36, 1] as const;

function cubicBezierY(t: number, p1x: number, p1y: number, p2x: number, p2y: number) {
  // Standard CSS-easing solve: Newton-Raphson for the parametric u where
  // Bx(u) === t (the elapsed-time fraction), then read back By(u).
  let u = t;
  for (let i = 0; i < 6; i++) {
    const x = 3 * (1 - u) ** 2 * u * p1x + 3 * (1 - u) * u ** 2 * p2x + u ** 3 - t;
    const dx = 3 * (1 - u) ** 2 * p1x + 6 * (1 - u) * u * (p2x - p1x) + 3 * u ** 2 * (1 - p2x);
    if (Math.abs(dx) < 1e-6) break;
    u = Math.min(1, Math.max(0, u - x / dx));
  }
  return 3 * (1 - u) ** 2 * u * p1y + 3 * (1 - u) * u ** 2 * p2y + u ** 3;
}

function easeSettle(t: number) {
  return cubicBezierY(t, ...EASE_SETTLE);
}

// Per IMPROVEMENT_PROMPT.md §4.5: trivial geometry (a thin box, not
// simulated pile), all the visual richness comes from texture + lighting.
// A thin box (not a flat plane) so rotating past 90° shows a real edge
// instead of the object vanishing to a hairline.
const BOX_ARGS: [number, number, number, number, number, number] = [2.6, 0.06, 3.4, 4, 1, 4];

export default function RugMesh({
  autoRotate,
  manualRotationRef,
  onManualRotate,
  onTextureReady,
  activeWeave,
}: {
  autoRotate: boolean;
  manualRotationRef: React.MutableRefObject<number>;
  onManualRotate: () => void;
  onTextureReady: () => void;
  activeWeave: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const overlayMaterialRef = useRef<MeshPhysicalMaterial>(null);
  // useTexture suspends while loading and THROWS on failure — by the time
  // this line returns, all three textures are confirmed loaded. Preloaded
  // eagerly rather than deferred to first switch: these are small local
  // JPGs already bundled by Vite (no network fetch to defer), and two of
  // the three are already decoded elsewhere on the page (FeaturedWeaves,
  // InYourSpace use the same files) — a second Suspense boundary to defer
  // them here would add complexity without saving a real request.
  const textures = useTexture([...WEAVE_TEXTURES]);
  const [dragging, setDragging] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const fadeProgressRef = useRef(0);

  useEffect(() => {
    onTextureReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeWeave === displayedIndex) return;
    fadeProgressRef.current = 0;
    setOverlayIndex(activeWeave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWeave]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (autoRotate && !dragging) {
      // one full rotation per ~40s, per spec §4.2
      meshRef.current.rotation.y += (Math.PI * 2 * delta) / 40;
    }
    if (manualRotationRef.current !== 0) {
      meshRef.current.rotation.y += manualRotationRef.current;
      manualRotationRef.current = 0;
    }

    if (overlayIndex !== null) {
      fadeProgressRef.current = Math.min(1, fadeProgressRef.current + delta / CROSSFADE_SECONDS);
      if (overlayMaterialRef.current) {
        overlayMaterialRef.current.opacity = easeSettle(fadeProgressRef.current);
      }
      if (fadeProgressRef.current >= 1) {
        setDisplayedIndex(overlayIndex);
        setOverlayIndex(null);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-0.15, 0, 0]}
      onPointerDown={() => {
        setDragging(true);
        onManualRotate();
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <boxGeometry args={BOX_ARGS} />
      {/* meshPhysicalMaterial over meshStandardMaterial for one thing only:
          a faint clearcoat pass. Matte wool stays matte (roughness 0.85) —
          the thin coat just catches the rim/key lights as soft micro-highlights,
          the way studio product photography reads as "expensive" rather than flat. */}
      <meshPhysicalMaterial
        map={textures[displayedIndex]}
        roughness={0.85}
        metalness={0}
        clearcoat={0.06}
        clearcoatRoughness={0.35}
      />
      {/* Crossfade overlay: same geometry, nested so it inherits the parent
          mesh's rotation for free, scaled up a hair to avoid z-fighting with
          the base mesh underneath. Opacity ramps 0→1 on --ease-settle, then
          the base map swaps and this unmounts — a real dissolve rather than
          an instant texture pop. */}
      {overlayIndex !== null && (
        <mesh scale={1.004}>
          <boxGeometry args={BOX_ARGS} />
          <meshPhysicalMaterial
            ref={overlayMaterialRef}
            map={textures[overlayIndex]}
            roughness={0.85}
            metalness={0}
            clearcoat={0.06}
            clearcoatRoughness={0.35}
            transparent
            depthWrite={false}
            opacity={0}
          />
        </mesh>
      )}
    </mesh>
  );
}
