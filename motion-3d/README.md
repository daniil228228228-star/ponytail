# motion-3d

3D animation via [Remotion](https://remotion.dev) + [Three.js](https://threejs.org) (`@remotion/three`). Closes the "3D animation" gap without Blender or any paid design connector — everything here is free and open source.

## Why the custom render flags

Remotion's renderer normally downloads its own "Chrome Headless Shell" binary on first render. In network-restricted environments (sandboxed CI, locked-down containers) that download gets blocked, and the render fails with `Received a status code of 403`.

The fix: point Remotion at an already-installed Chromium binary and tell it to treat that binary as regular "Chrome for Testing" (not the headless-shell variant it expects by default):

```bash
npx remotion render Cube3D out/cube.mp4 \
  --browser-executable=/opt/pw-browsers/chromium \
  --chrome-mode=chrome-for-testing
```

This is wired up as `npm run render`.

**If you're on a machine with normal internet access**, you don't need any of this — just run `npx remotion render Cube3D out/cube.mp4` and Remotion will download its own browser automatically. The `--browser-executable` path above (`/opt/pw-browsers/chromium`) is specific to the sandboxed Claude Code environment this was built in; adjust or drop it to match your own Chromium/Chrome install path (or omit both flags entirely for the default behavior).

## Usage

```bash
npm install
npm run dev      # Remotion Studio — live preview/editor
npm run render   # render Cube3D to out/cube.mp4
```

`src/Composition.tsx` has a minimal rotating-cube demo (`Cube3D`) showing the `@remotion/three` + `ThreeCanvas` pattern — swap in your own scene, materials, camera, lights.
