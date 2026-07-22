import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-file demo build only — `npm run build:standalone`. Produces one
// self-contained dist/index.html with no separate JS/CSS/chunk files, so
// it opens directly via file:// (e.g. double-tapping it from an Android
// file manager) with no local server needed. Chromium blocks ANY async
// fetch of a separate file from a file:// page, not just type="module"
// imports — plugin-legacy's SystemJS fallback still fetches its target
// script over the network under the hood, so a fully inlined single file
// is the only thing that reliably works.
//
// This intentionally disables the lazy-loaded 3D chunk from the normal
// build (vite.config.ts) — everything, including Three.js, gets inlined
// into the one file. That's the right tradeoff for a portable demo file
// and the wrong one for a real deployment; use the normal `npm run build`
// for anything that will actually be hosted.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-standalone',
    cssCodeSplit: false,
  },
})
