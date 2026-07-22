import { lazy, Suspense, useState } from 'react';
import { IMAGES } from '../images';
import RugViewerErrorBoundary from './RugViewerErrorBoundary';

// Progressive enhancement per IMPROVEMENT_PROMPT.md §4.5: the flat photo
// is the fast-loading placeholder, the 3D scene is the payoff once its
// dynamic import (and Three.js itself) resolves. This keeps Three.js out
// of the main bundle entirely — verified via `npm run build` chunk output.
const RugViewer = lazy(() => import('./RugViewer'));

export default function RugViewerLazy() {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative w-full h-full">
      <img
        src={IMAGES.foldedRug}
        alt="Ковёр Бахтияри Ромб"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
      />
      {/* ErrorBoundary sits OUTSIDE Suspense: a failed texture load or any
          other 3D runtime error must fall back to the static photo, not
          take down the rest of the page (a blocked/expired image request
          did exactly that before this boundary existed). `ready` is only
          flipped by RugMesh itself, once its useTexture call has actually
          resolved — not just once the lazy JS chunk has loaded — so the
          photo never gets hidden ahead of a texture that then fails. */}
      <RugViewerErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <RugViewer onTextureReady={() => setReady(true)} />
          </div>
        </Suspense>
      </RugViewerErrorBoundary>
    </div>
  );
}
