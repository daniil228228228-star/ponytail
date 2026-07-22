import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // Chromium blocks ANY async fetch of a separate file from a file://
    // page — not just type="module" imports, but also plugin-legacy's
    // SystemJS-based System.import() fallback, which still fetches the
    // target script over the network under the hood. The only thing that
    // reliably works from file:// is a single HTML file with the JS/CSS
    // already embedded as literal inline text (no src="" to fetch at
    // all). viteSingleFile inlines the whole built bundle (JS, CSS,
    // assets under assetsInlineLimit) directly into index.html, so the
    // built site can be opened by double-tapping that one file (e.g. from
    // an Android file manager) with zero additional loads.
    viteSingleFile(),
  ],
  build: {
    // ensure nothing gets split into a separate chunk that singlefile
    // would then have nothing to inline
    cssCodeSplit: false,
  },
})
