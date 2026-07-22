import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
// Import the specific submodule, not the drei barrel — bypasses
// re-exports for unrelated helpers and keeps the lazy 3D chunk smaller
// (IMPROVEMENT_PROMPT.md §8/§10 bundle budget).
import { useTexture } from '@react-three/drei/core/Texture';
import type { Mesh } from 'three';
import { IMAGES } from '../images';

// Per IMPROVEMENT_PROMPT.md §4.5: trivial geometry (a thin box, not
// simulated pile), all the visual richness comes from texture + lighting.
// A thin box (not a flat plane) so rotating past 90° shows a real edge
// instead of the object vanishing to a hairline.
export default function RugMesh({
  autoRotate,
  manualRotationRef,
  onManualRotate,
  onTextureReady,
}: {
  autoRotate: boolean;
  manualRotationRef: React.MutableRefObject<number>;
  onManualRotate: () => void;
  onTextureReady: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  // useTexture suspends while loading and THROWS on failure — by the time
  // this line returns a value, the texture is confirmed loaded. That's
  // deliberately when the caller is told it's safe to hide the flat-photo
  // fallback (see RugViewerLazy.tsx), not merely "the JS chunk arrived".
  const texture = useTexture(IMAGES.foldedRug);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    onTextureReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <boxGeometry args={[2.6, 0.06, 3.4, 4, 1, 4]} />
      {/* meshPhysicalMaterial over meshStandardMaterial for one thing only:
          a faint clearcoat pass. Matte wool stays matte (roughness 0.85) —
          the thin coat just catches the rim/key lights as soft micro-highlights,
          the way studio product photography reads as "expensive" rather than flat. */}
      <meshPhysicalMaterial
        map={texture}
        roughness={0.85}
        metalness={0}
        clearcoat={0.06}
        clearcoatRoughness={0.35}
      />
    </mesh>
  );
}
