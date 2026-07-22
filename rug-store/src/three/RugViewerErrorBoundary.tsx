import { Component, type ReactNode } from 'react';

// Any failure inside the 3D viewer (texture load failure, no WebGL, a
// Three.js runtime error) must degrade to the flat photo, never take down
// the rest of the page. Without this boundary, a single failed texture
// fetch (e.g. a network hiccup, an expired signed URL) throws past
// react-three-fiber's render tree and unmounts the entire React app —
// verified this the hard way: a blocked image request blanked the whole
// site, not just the hero.
export default class RugViewerErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('3D rug viewer failed, falling back to static photo:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
