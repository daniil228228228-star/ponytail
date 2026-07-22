# image-style

Free, offline AI image generation (neural style transfer) — no API key, no paid connector, no browser. Closes the "photo generation" gap identified during the design-tool audit.

Uses [`@magenta/image`](https://www.npmjs.com/package/@magenta/image)'s Arbitrary Style Transfer network: takes a content image + a style image, and produces a new image with the content's structure rendered in the style's visual texture. Model weights (~180KB) download once from `storage.googleapis.com/magentadata/...` and are cached by the OS afterward.

## Why this needed extra setup

`@magenta/image` is built for the browser (uses `document`, `Image`, `ImageData`). This runs it in plain Node instead via:

- [`jsdom`](https://www.npmjs.com/package/jsdom) — supplies `window`/`document`/`Image`
- [`canvas`](https://www.npmjs.com/package/canvas) — real 2D rendering (Cairo-backed) for `ImageData` and canvas I/O; also decodes/encodes your actual PNG/JPEG files

`canvas` needs system libraries to build. On Debian/Ubuntu:

```bash
apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev pkg-config
```

(`librsvg2-dev` is in most `canvas` install guides too, but isn't required for this script — skip it if your environment can't reach that package's dependency chain.)

TensorFlow.js falls back to its CPU backend automatically (no WebGL in Node) — slower than a GPU/browser, but correct, and fine for single images.

## Usage

```bash
npm install
npm run demo                                    # procedurally generated content/style, no input files needed
node stylize.js content.png style.png out.png    # your own images
```

`content.png` / `style.png` can be any image format `node-canvas`'s `loadImage` supports (PNG, JPEG, GIF, SVG with `librsvg2-dev` installed additionally).
