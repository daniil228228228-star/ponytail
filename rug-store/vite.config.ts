import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard build: normal code-splitting, real chunking. This is what a
// real deployment (real hosting, not a file:// demo) should use — it lets
// the 3D viewer (@react-three/fiber + drei + three) stay in its own lazy
// chunk instead of bloating the initial page load. See
// vite.config.standalone.ts for the single-file variant used only to
// produce a demo file that opens directly via file:// (e.g. an Android
// file manager) — that variant intentionally inlines everything, which
// is right for a portable demo and wrong for production performance.
export default defineConfig({
  base: './',
  plugins: [react()],
})
