import heroTexture from './assets/heroTexture.jpg';
import rolledRug from './assets/rolledRug.jpg';
import loomCraft from './assets/loomCraft.jpg';

// heroTexture, rolledRug, loomCraft are now permanent local assets (bundled
// by Vite, hashed filename, no expiry) — cropped from the user's own Canva
// exports. foldedRug is still a temporary signed Canva export URL (valid a
// few hours from generation) pending the correct file from the user; the
// screenshot sent for it didn't match (wrong design), so it's not swapped yet.
export const IMAGES = {
  heroTexture,
  foldedRug:
    'https://export-download.canva.com/c50yc/DAHQIBc50yc/-1/0/0001-6422643396389853470.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260722%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260722T183848Z&X-Amz-Expires=7323&X-Amz-Signature=c284314f21e87c54fc9c62bdc9116752e34b8e9094a29f091be90da886a4d643&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Wed%2C%2022%20Jul%202026%2020%3A40%3A51%20GMT',
  rolledRug,
  loomCraft,
} as const;
