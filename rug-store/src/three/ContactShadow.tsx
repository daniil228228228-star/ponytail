import { useMemo } from 'react';
import * as THREE from 'three';

// Lightweight stand-in for drei's ContactShadows — a single radial-gradient
// canvas texture on a flat plane, instead of drei's render-target + blur-pass
// approach. Good enough at this camera distance and adds ~0 bytes to the
// already over-budget 3D chunk (no new dependency, just Canvas2D + THREE.CanvasTexture).
function makeShadowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(20,14,10,0.5)');
  gradient.addColorStop(0.55, 'rgba(20,14,10,0.24)');
  gradient.addColorStop(1, 'rgba(20,14,10,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function ContactShadow() {
  const texture = useMemo(() => makeShadowTexture(), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[4.6, 5.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
