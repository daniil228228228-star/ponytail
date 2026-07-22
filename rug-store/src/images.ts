import heroTexture from './assets/heroTexture.jpg';
import foldedRug from './assets/foldedRug.jpg';
import rolledRug from './assets/rolledRug.jpg';
import loomCraft from './assets/loomCraft.jpg';

// All four are permanent local assets (bundled by Vite, hashed filename, no
// expiry) — cropped from the user's own Canva exports, replacing the
// temporary signed export URLs that kept expiring. Note: foldedRug and
// rolledRug turned out to be the same generated photo (same Canva design
// title on both) — not a bug, just how the two were originally sourced.
export const IMAGES = {
  heroTexture,
  foldedRug,
  rolledRug,
  loomCraft,
} as const;
